import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Paginated } from '../../../../common/queries';

import { FindPaginatedUsersQuery } from './find-paginated-users.query';
import { UsersPort } from '../../ports';
import { User } from '../../entities';

@QueryHandler(FindPaginatedUsersQuery)
export class FindPaginatedUsersQueryHandler
  implements IQueryHandler<FindPaginatedUsersQuery>
{
  public constructor(private readonly usersPort: UsersPort) {}

  public async execute({
    where,
    options,
  }: FindPaginatedUsersQuery): Promise<Paginated<User[]>> {
    const [items, total] = await Promise.all([
      this.usersPort.find(where, options),
      this.usersPort.count(where),
    ]);

    return {
      items,
      total,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    };
  }
}
