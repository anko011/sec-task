import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  ForeignKeyConstraintViolationException,
} from '@mikro-orm/better-sqlite';

import { OrganizationType } from '../../entities';

import { DeleteOrganizationTypeCommand } from './delete-organization-type.command';
import { ConflictException, NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteOrganizationTypeCommand)
export class DeleteOrganizationTypeCommandHandler
  implements ICommandHandler<DeleteOrganizationTypeCommand>
{
  public constructor(
    @InjectRepository(OrganizationType)
    private readonly organizationTypesRepository: EntityRepository<OrganizationType>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({ id }: DeleteOrganizationTypeCommand): Promise<void> {
    const organizationType = await this.organizationTypesRepository.findOne({
      id,
    });
    if (!organizationType)
      throw new NotFoundException(`Organization type with id ${id} not found`);
    try {
      await this.entityManager.removeAndFlush(organizationType);
    } catch (e) {
      if (e instanceof ForeignKeyConstraintViolationException) {
        throw new ConflictException(
          `Cannot delete the organization type with id ${id} because it is referenced by other entities.`,
        );
      }

      throw e;
    }
  }
}
