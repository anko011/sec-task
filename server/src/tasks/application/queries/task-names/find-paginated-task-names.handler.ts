import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Paginated, prepareSearchConditions } from '../../../../common/queries';
import { TaskName } from '../../entities';

import { FindPaginatedTaskNamesQuery } from './find-paginated-task-names.query';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';

@QueryHandler(FindPaginatedTaskNamesQuery)
export class FindPaginatedTaskNamesHandler
  implements IQueryHandler<FindPaginatedTaskNamesQuery>
{
  constructor(
    @InjectRepository(TaskName)
    private readonly taskNamesRepository: EntityRepository<TaskName>,
  ) {}

  async execute({
    where,
    options,
  }: FindPaginatedTaskNamesQuery): Promise<Paginated<TaskName[]>> {
    const [items, total] = await this.taskNamesRepository.findAndCount(
      prepareSearchConditions({ ...where }),
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
