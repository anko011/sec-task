import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { TaskPackage } from '../../entities/task-package';
import { Paginated } from '../../../../common/queries';
import { TaskPackagesPort } from '../../ports';

import { FindPaginatedTaskPackagesQuery } from './find-paginated-task-packages.query';

@QueryHandler(FindPaginatedTaskPackagesQuery)
export class FindPaginatedTaskPackagesQueryHandler
  implements IQueryHandler<FindPaginatedTaskPackagesQuery>
{
  constructor(private readonly taskPackagesPort: TaskPackagesPort) {}

  async execute({
    where,
    options,
  }: FindPaginatedTaskPackagesQuery): Promise<Paginated<TaskPackage[]>> {
    const [items, total] = await Promise.all([
      this.taskPackagesPort.find(where, options),
      this.taskPackagesPort.count(where),
    ]);

    return {
      items,
      total,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    };
  }
}
