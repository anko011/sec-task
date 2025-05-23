import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';
import { deepCleanObject } from '~/common/utils';

import { Paginated } from '../../../../common/queries';

import { FindPaginatedUsersQuery } from './find-paginated-users.query';
import { User } from '../../entities';

@QueryHandler(FindPaginatedUsersQuery)
export class FindPaginatedUsersQueryHandler
  implements IQueryHandler<FindPaginatedUsersQuery>
{
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
  ) {}

  public async execute({
    where,
    options,
  }: FindPaginatedUsersQuery): Promise<Paginated<User[]>> {
    const [items, total] = await this.usersRepository.findAndCount(
      deepCleanObject({
        ...where,
        organizationId: null,
        organization: where?.organizationId,
      }),
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
