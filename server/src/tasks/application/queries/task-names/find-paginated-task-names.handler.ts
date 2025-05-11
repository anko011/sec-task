import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Paginated } from '../../../../common/queries';

import { TaskNamesPort } from '../../ports';
import { TaskName } from '../../entities';

import { FindPaginatedTaskNamesQuery } from './find-paginated-task-names.query';

@QueryHandler(FindPaginatedTaskNamesQuery)
export class FindPaginatedTaskNamesHandler
  implements IQueryHandler<FindPaginatedTaskNamesQuery>
{
  constructor(private readonly taskNamesPort: TaskNamesPort) {}

  async execute({
    where,
    options,
  }: FindPaginatedTaskNamesQuery): Promise<Paginated<TaskName[]>> {
    const [items, total] = await Promise.all([
      this.taskNamesPort.find(where, options),
      this.taskNamesPort.count(where),
    ]);

    return {
      items,
      total,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    };
  }
}
