import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityRepository } from '@mikro-orm/better-sqlite';

import { Organization } from '../../entities';

import { FindOrganizationQuery } from './find-organization.query';

@QueryHandler(FindOrganizationQuery)
export class FindOrganizationQueryHandler
  implements IQueryHandler<FindOrganizationQuery>
{
  public constructor(
    @InjectRepository(Organization)
    private readonly organizationsRepository: EntityRepository<Organization>,
  ) {}

  public async execute({ id }: FindOrganizationQuery): Promise<Organization> {
    const organization = await this.organizationsRepository.findOne(id);

    if (!organization)
      throw new NotFoundException(`Organization with id ${id} not found`);

    return organization;
  }
}
