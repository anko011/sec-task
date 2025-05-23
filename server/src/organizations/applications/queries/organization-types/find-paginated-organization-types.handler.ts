import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';

import { Paginated, prepareSearchConditions } from '~/common/queries';

import { OrganizationType } from '../../entities';

import { FindPaginatedOrganizationTypesQuery } from './find-paginated-organization-types.query';

@QueryHandler(FindPaginatedOrganizationTypesQuery)
export class FindPaginatedOrganizationTypesQueryHandler
  implements IQueryHandler<FindPaginatedOrganizationTypesQuery>
{
  public constructor(
    @InjectRepository(OrganizationType)
    private readonly organizationTypesRepository: EntityRepository<OrganizationType>,
  ) {}

  public async execute({
    where,
    options,
  }: FindPaginatedOrganizationTypesQuery): Promise<
    Paginated<OrganizationType[]>
  > {
    const [items, total] = await this.organizationTypesRepository.findAndCount(
      prepareSearchConditions(where ?? {}),
      options,
    );

    return {
      items,
      total,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    };
  }
}
