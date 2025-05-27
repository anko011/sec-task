import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePackageUserCommand } from '~/users/application/commands/users/create-package-user.command';
import { BadRequestException, Logger } from '@nestjs/common';
import { CsvParser } from 'nest-csv-parser';
import { Role, User } from '~/users/application/entities';
import * as fs from 'node:fs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';
import {
  Organization,
  OrganizationType,
} from '~/organizations/applications/entities';
import { genSalt, hash } from 'bcryptjs';

class CsvEntity {
  public readonly firstName: string;
  public readonly secondName: string;
  public readonly patronymic: string;
  public readonly email: string;
  public readonly role: Role;
  public readonly password: string;
  public readonly organizationName?: string;
  public readonly organizationTypeName?: string;
}

const headersMapping = {
  Фамилия: 'secondName',
  Имя: 'firstName',
  Отчество: 'patronymic',
  Email: 'email',
  Пароль: 'password',
  Роль: 'role',
  'Наименование организации': 'organizationName',
  'Наименование типа организации': 'organizationTypeName',
};

@CommandHandler(CreatePackageUserCommand)
export class CreatePackageUserCommandHandler
  implements ICommandHandler<CreatePackageUserCommand>
{
  private readonly logger = new Logger(CreatePackageUserCommandHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    @InjectRepository(Organization)
    private readonly organizationsRepository: EntityRepository<Organization>,
    @InjectRepository(OrganizationType)
    private readonly organizationTypesRepository: EntityRepository<OrganizationType>,
    private readonly entityManager: EntityManager,
    private readonly csvParser: CsvParser,
  ) {}

  async execute({ file }: CreatePackageUserCommand): Promise<void> {
    const stream = fs.ReadStream.from(file.buffer);

    const { list } = await this.csvParser.parse(
      stream,
      CsvEntity,
      undefined,
      undefined,
      {
        mapHeaders: ({ header }: { header: string }) =>
          headersMapping[header.trim()],
        mapValues: ({ value }: { header: string; value: string }) => {
          const trimmedValue = value.trim();
          return trimmedValue === '' ? undefined : trimmedValue;
        },
      },
    );

    const csvEntities = list as CsvEntity[];

    const errors = csvEntities.flatMap((value, index) =>
      this.validateCsvEntity(value, index),
    );

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const existingEmails = (
      await this.usersRepository.findAll({
        where: {
          email: { $in: csvEntities.map((e) => e.email) },
        },
        fields: ['email'],
      })
    ).map((u) => u.email);

    const emailErrors = csvEntities.reduce(
      (acc, curr, i) => {
        if (existingEmails.includes(curr.email)) {
          acc.push({
            line: i + 1,
            message: `Пользователь с email ${curr.email} уже существует`,
          });
        }
        return acc;
      },
      [] as { line: number; message: string }[],
    );

    if (emailErrors.length > 0) {
      throw new BadRequestException(emailErrors);
    }

    const organizationTypeNames = [
      ...new Set(
        csvEntities
          .map((e) => e.organizationTypeName)
          .filter((name) => name !== undefined),
      ),
    ];

    const organizationTypes = await this.processOrganizationTypes(
      organizationTypeNames,
    );

    const organizations = await this.processOrganizations(
      csvEntities,
      organizationTypes,
    );

    await this.createUsers(csvEntities, organizations);
  }

  private async processOrganizationTypes(
    typeNames: string[],
  ): Promise<Map<string, OrganizationType>> {
    const typeMap = new Map<string, OrganizationType>();

    if (typeNames.length === 0) {
      return typeMap;
    }

    const existingTypes = await this.organizationTypesRepository.find({
      title: { $in: typeNames },
    });

    existingTypes.forEach((type) => typeMap.set(type.title, type));

    const newTypeNames = typeNames.filter(
      (name) => !Array.from(typeMap.keys()).includes(name),
    );

    for (const name of newTypeNames) {
      const newType = this.organizationTypesRepository.create({
        title: name,
      });
      typeMap.set(name, newType);
    }

    await this.entityManager.persistAndFlush(
      Array.from(typeMap.values()).filter((t) => !t.id),
    );

    return typeMap;
  }

  private async processOrganizations(
    csvEntities: CsvEntity[],
    typeMap: Map<string, OrganizationType>,
  ): Promise<Map<string, Organization>> {
    const organizationMap = new Map<string, Organization>();

    // Получаем уникальные пары organizationName + organizationTypeName
    const orgEntries = csvEntities
      .filter((e) => e.organizationName && e.organizationTypeName)
      .map((e) => ({
        name: e.organizationName,
        typeName: e.organizationTypeName,
      }));

    const uniqueOrgEntries = Array.from(
      new Set(orgEntries.map((e) => JSON.stringify(e))),
    ).map((e) => JSON.parse(e));

    if (uniqueOrgEntries.length === 0) {
      return organizationMap;
    }

    // Поиск существующих организаций
    const existingOrgs = await this.organizationsRepository.find({
      name: { $in: uniqueOrgEntries.map((e) => e.name) },
      type: { $in: Array.from(typeMap.values()) },
    });

    // Добавление существующих организаций в карту
    existingOrgs.forEach((org) => {
      const key = `${org.name}_${org.type.title}`;
      organizationMap.set(key, org);
    });

    // Создание отсутствующих организаций
    for (const entry of uniqueOrgEntries) {
      const key = `${entry.name}_${entry.typeName}`;
      if (!organizationMap.has(key)) {
        const type = typeMap.get(entry.typeName);
        if (!type) continue;

        const newOrg = this.organizationsRepository.create({
          name: entry.name,
          type: type,
          isArchived: false,
        });
        organizationMap.set(key, newOrg);
      }
    }

    await this.entityManager.persistAndFlush(
      Array.from(organizationMap.values()).filter((o) => !o.id),
    );

    return organizationMap;
  }

  private async createUsers(
    csvEntities: CsvEntity[],
    organizationMap: Map<string, Organization>,
  ): Promise<void> {
    const usersToCreate = await Promise.all(
      csvEntities.map(async (entity) => {
        let organization: Organization | null = null;

        if (entity.organizationName && entity.organizationTypeName) {
          const key = `${entity.organizationName}_${entity.organizationTypeName}`;
          organization = organizationMap.get(key) || null;
        }

        return new User(
          entity.firstName,
          entity.secondName,
          entity.patronymic,
          entity.email,
          entity.role,
          await hash(entity.password, await genSalt()),
          organization?.id,
        );
      }),
    );

    await this.entityManager.persistAndFlush(usersToCreate);
  }

  private validateCsvEntity(
    entity: CsvEntity,
    index: number,
  ): { line: number; message: string }[] {
    const errors: { line: number; message: string }[] = [];

    const requiredFields = [
      'firstName',
      'secondName',
      'patronymic',
      'email',
      'role',
      'password',
    ];

    const line = index + 1;

    for (const field of requiredFields) {
      if (!entity[field]) {
        errors.push({
          line,
          message: `Поле "${field}" обязательно для заполнения`,
        });
      }
    }

    if (!Object.values(Role).includes(entity.role)) {
      errors.push({
        line,
        message: `Недопустимое значение роли "${entity.role}".`,
      });
    }

    if (entity.role === Role.Assigner) {
      if (!entity.organizationName) {
        errors.push({
          line,
          message: 'Поле "organizationName" обязательно для роли Assigner',
        });
      }
      if (!entity.organizationTypeName) {
        errors.push({
          line,
          message: 'Поле "organizationTypeName" обязательно для роли Assigner',
        });
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(entity.email)) {
      errors.push({
        line,
        message: 'Некорректный формат email',
      });
    }

    return errors;
  }
}
