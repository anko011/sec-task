import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Paginated } from '../../../../common/queries';

import { TaskCategoriesPort } from '../../ports';
import { TaskCategory } from '../../entities';

import { FindPaginatedTaskCategoriesQuery } from './find-paginated-task-categories.query';

@QueryHandler(FindPaginatedTaskCategoriesQuery)
export class FindPaginatedTaskCategoriesHandler
  implements IQueryHandler<FindPaginatedTaskCategoriesQuery>
{
  constructor(private readonly taskCategoriesPort: TaskCategoriesPort) {}

  async execute({
    where,
    options,
  }: FindPaginatedTaskCategoriesQuery): Promise<Paginated<TaskCategory[]>> {
    const [items, total] = await Promise.all([
      this.taskCategoriesPort.find(where, options),
      this.taskCategoriesPort.count(where),
    ]);

    return {
      items,
      total,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    };
  }
}
