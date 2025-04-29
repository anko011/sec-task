import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { FindPaginatedTasksQuery } from './find-paginated-tasks.query';

import { TaskPackagesPort } from '../../ports';
import { Task, TaskPackage } from '../../entities';

import { Paginated } from '../../../../common/queries';

@QueryHandler(FindPaginatedTasksQuery)
export class FindPaginatedTasksQueryHandler
  implements IQueryHandler<FindPaginatedTasksQuery>
{
  public constructor(private readonly taskPackagesPort: TaskPackagesPort) {}

  public async execute({
    packageId,
    where,
    options,
  }: FindPaginatedTasksQuery): Promise<Paginated<Task[]>> {
    const taskPackage: TaskPackage | null =
      await this.taskPackagesPort.find(packageId);

    if (!taskPackage)
      throw new NotFoundException(`TaskPackage ${packageId} not found`);

    const tasks = taskPackage.getTasks(where, options?.limit, options?.offset);
    const total = taskPackage.getTaskCount();

    return {
      items: tasks,
      total,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    };
  }
}
