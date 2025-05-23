import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';

import { deepCleanObject } from '~/common/utils';

import { Organization } from '../../entities';

import { UpdateOrganizationCommand } from './update-organization.command';

@CommandHandler(UpdateOrganizationCommand)
export class UpdateOrganizationCommandHandler
  implements ICommandHandler<UpdateOrganizationCommand>
{
  public constructor(
    @InjectRepository(Organization)
    private readonly organizationsRepository: EntityRepository<Organization>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({
    id,
    dto,
  }: UpdateOrganizationCommand): Promise<Organization> {
    const organization = await this.organizationsRepository.findOne({
      id,
    });

    if (!organization)
      throw new BadRequestException(`Organization  with id ${id} not found`);

    const updatedOrganizationType = this.organizationsRepository.assign(
      organization,
      deepCleanObject({ ...dto, typeId: null, type: dto.typeId }),
    );

    await this.entityManager.persistAndFlush(updatedOrganizationType);

    return updatedOrganizationType;
  }
}
