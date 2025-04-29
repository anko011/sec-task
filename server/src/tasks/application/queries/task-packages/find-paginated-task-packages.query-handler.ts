import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { TaskPackage } from '../../entities/task-package';
import { Paginated } from '../../../../common/queries';
import { TaskPackagesPort } from '../../ports';

import { FindPaginatedTaskPackagesQuery } from './find-paginated-task-packages.query';

@QueryHandler(FindPaginatedTaskPackagesQuery)
export class FindPaginatedTaskPackagesQueryHandler
  implements IQueryHandler<FindPaginatedTaskPackagesQuery>
{
  public constructor(
    private readonly taskPackagesRepository: TaskPackagesPort,
  ) {}

  public async execute({
    where,
    options,
  }: FindPaginatedTaskPackagesQuery): Promise<Paginated<TaskPackage[]>> {
    const [tasks, total] = await this.taskPackagesRepository.findAndCount(
      where,
      options,
    );

    return {
      items: tasks,
      total,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    };
  }
}
