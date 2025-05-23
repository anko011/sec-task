import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Organization } from '../../entities';

import { CreateOrganizationCommand } from './create-organization.command';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationCommandHandler
  implements ICommandHandler<CreateOrganizationCommand>
{
  constructor(
    @InjectRepository(Organization)
    private readonly organizationsRepository: EntityRepository<Organization>,
    private readonly entityManager: EntityManager,
  ) {}

  async execute({ dto }: CreateOrganizationCommand): Promise<Organization> {
    console.log(dto);
    const organization = this.organizationsRepository.create({
      ...dto,
      type: dto.typeId,
      isArchived: !!dto.isArchived,
    });

    await this.entityManager.persistAndFlush(organization);

    return organization;
  }
}
