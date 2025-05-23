import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  ForeignKeyConstraintViolationException,
} from '@mikro-orm/better-sqlite';

import { Organization } from '../../entities';

import { DeleteOrganizationCommand } from './delete-organization.command';

@CommandHandler(DeleteOrganizationCommand)
export class DeleteOrganizationCommandHandler
  implements ICommandHandler<DeleteOrganizationCommand>
{
  public constructor(
    @InjectRepository(Organization)
    private readonly organizationsRepository: EntityRepository<Organization>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({ id }: DeleteOrganizationCommand): Promise<void> {
    const organization = await this.organizationsRepository.findOne({
      id,
    });

    if (!organization)
      throw new NotFoundException(`Organization with id ${id} not found`);

    try {
      await this.entityManager.removeAndFlush(organization);
    } catch (e) {
      if (e instanceof ForeignKeyConstraintViolationException) {
        throw new ConflictException(
          `Cannot delete the organization with id ${id} because it is referenced by other entities.`,
        );
      }

      throw e;
    }
  }
}
