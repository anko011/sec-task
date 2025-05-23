import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';

import { OrganizationType } from '../../entities';

import { FindOrganizationTypeQuery } from './find-organization-type.query';

@QueryHandler(FindOrganizationTypeQuery)
export class FindOrganizationTypeQueryHandler
  implements IQueryHandler<FindOrganizationTypeQuery>
{
  public constructor(
    @InjectRepository(OrganizationType)
    private readonly organizationTypesRepository: EntityRepository<OrganizationType>,
  ) {}

  public async execute({
    id,
  }: FindOrganizationTypeQuery): Promise<OrganizationType> {
    const organizationType = await this.organizationTypesRepository.findOne(id);

    if (!organizationType)
      throw new NotFoundException(`Organization type with id ${id} not found`);

    return organizationType;
  }
}
