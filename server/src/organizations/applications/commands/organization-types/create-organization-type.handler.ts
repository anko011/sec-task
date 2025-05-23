import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';

import { OrganizationType } from '../../entities';
import { CreateOrganizationTypeCommand } from './create-organization-type.command';

@CommandHandler(CreateOrganizationTypeCommand)
export class CreateOrganizationTypeCommandHandler
  implements ICommandHandler<CreateOrganizationTypeCommand>
{
  constructor(
    @InjectRepository(OrganizationType)
    private readonly organizationTypesRepository: EntityRepository<OrganizationType>,
    private readonly entityManager: EntityManager,
  ) {}

  async execute({
    dto,
  }: CreateOrganizationTypeCommand): Promise<OrganizationType> {
    const organizationType = this.organizationTypesRepository.create(dto);

    await this.entityManager.persistAndFlush(organizationType);

    return organizationType;
  }
}
