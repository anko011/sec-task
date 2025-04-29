import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Paginated } from '../../../../common/queries';

import { FindPaginatedUsersQuery } from './find-paginated-users.query';
import { UsersStorePort } from '../../ports';
import { User } from '../../entities';

@QueryHandler(FindPaginatedUsersQuery)
export class FindPaginatedUsersQueryHandler
  implements IQueryHandler<FindPaginatedUsersQuery>
{
  public constructor(private readonly usersPort: UsersStorePort) {}

  public async execute({
    where,
    options,
  }: FindPaginatedUsersQuery): Promise<Paginated<User[]>> {
    const [tasks, total] = await this.usersPort.findAndCount(where, options);

    return {
      items: tasks,
      total,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    };
  }
}
