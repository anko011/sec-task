import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';

import { Paginated, prepareSearchConditions } from '~/common/queries';

import { Organization } from '../../entities';

import { FindPaginatedOrganizationsQuery } from './find-paginated-organizations.query';

@QueryHandler(FindPaginatedOrganizationsQuery)
export class FindPaginatedOrganizationsQueryHandler
  implements IQueryHandler<FindPaginatedOrganizationsQuery>
{
  public constructor(
    @InjectRepository(Organization)
    private readonly organizationsRepository: EntityRepository<Organization>,
  ) {}

  public async execute({
    where,
    options,
  }: FindPaginatedOrganizationsQuery): Promise<Paginated<Organization[]>> {
    const [items, total] = await this.organizationsRepository.findAndCount(
      prepareSearchConditions({ ...where, typeId: null, type: where?.typeId }),
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
