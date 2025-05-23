import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Paginated, prepareSearchConditions } from '../../../../common/queries';
import { FindPaginatedUsersWithOrganizationQuery } from './find-paginated-users-with-organization.query';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '~/users/application/entities';
import { EntityRepository } from '@mikro-orm/better-sqlite';

@QueryHandler(FindPaginatedUsersWithOrganizationQuery)
export class FindPaginatedUsersWithOrganizationQueryHandler
  implements IQueryHandler<FindPaginatedUsersWithOrganizationQuery>
{
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
  ) {}

  public async execute({
    where,
    options,
  }: FindPaginatedUsersWithOrganizationQuery): Promise<Paginated<User[]>> {
    const conditions = prepareSearchConditions({
      ...where,
      organizationName: null,
      organization:
        where?.organizationName && where.organizationName !== ''
          ? {
              name: where?.organizationName,
            }
          : null,
    });

    const [items, total] = await this.usersRepository.findAndCount(conditions, {
      ...options,
      populate: ['organization'],
    });

    return {
      items,
      total,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    };
  }
}
