import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';

import { deepCleanObject } from '~/common/utils';

import { OrganizationType } from '../../entities';

import { UpdateOrganizationTypeCommand } from './update-organization-type.command';

@CommandHandler(UpdateOrganizationTypeCommand)
export class UpdateOrganizationTypeCommandHandler
  implements ICommandHandler<UpdateOrganizationTypeCommand>
{
  public constructor(
    @InjectRepository(OrganizationType)
    private readonly organizationTypesRepository: EntityRepository<OrganizationType>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({
    id,
    dto,
  }: UpdateOrganizationTypeCommand): Promise<OrganizationType> {
    const organizationType = await this.organizationTypesRepository.findOne({
      id,
    });

    if (!organizationType)
      throw new BadRequestException(
        `Organization type with id ${id} not found`,
      );

    const updatedOrganizationType = this.organizationTypesRepository.assign(
      organizationType,
      deepCleanObject(dto),
    );

    await this.entityManager.persistAndFlush(updatedOrganizationType);

    return updatedOrganizationType;
  }
}
