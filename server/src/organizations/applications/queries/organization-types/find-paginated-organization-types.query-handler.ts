import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FindPaginatedOrganizationTypesQuery } from './find-paginated-organization-types.query';

import { Paginated } from '../../../../common/queries';
import { OrganizationTypesPort } from '../../ports';
import { OrganizationType } from '../../entities';

@QueryHandler(FindPaginatedOrganizationTypesQuery)
export class FindPaginatedOrganizationTypesQueryHandler
  implements IQueryHandler<FindPaginatedOrganizationTypesQuery>
{
  public constructor(
    private readonly organizationTypesPort: OrganizationTypesPort,
  ) {}

  public async execute({
    where,
    options,
  }: FindPaginatedOrganizationTypesQuery): Promise<
    Paginated<OrganizationType[]>
  > {
    const [items, total] = await Promise.all([
      this.organizationTypesPort.find(where, options),
      this.organizationTypesPort.count(where),
    ]);

    return {
      items,
      total,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    };
  }
}
