import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Task } from '../../entities/task-package';
import { Paginated, PaginationOptions } from '../../../../common/queries';
import { TaskPackagesPort } from '../../ports';

import { FindPaginatedTasksQuery } from './find-paginated-tasks.query';
import { BadRequestException } from '@nestjs/common';

@QueryHandler(FindPaginatedTasksQuery)
export class FindPaginatedTasksQueryHandler
  implements IQueryHandler<FindPaginatedTasksQuery>
{
  constructor(private readonly taskPackagesPort: TaskPackagesPort) {}

  async execute({
    packageId,
    where,
    options,
  }: FindPaginatedTasksQuery): Promise<Paginated<Task[]>> {
    const packages = await this.taskPackagesPort.find({
      id: packageId,
    });

    if (packages.length !== 1)
      throw new BadRequestException(`Package ${packageId} not found`);

    const taskPackage = packages[0];

    const items = taskPackage.tasks.filter((item) => {
      const isNumberMatch =
        where?.number == null ||
        item.number
          .trim()
          .toLowerCase()
          .includes(where.number.trim().toLowerCase());

      const isNameId = where?.nameId == null || item.name.id === where.nameId;

      return isNumberMatch && isNameId;
    });

    return {
      items: this.applyPagination(items, options),
      total: taskPackage.tasks.length,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    };
  }

  private applyPagination(
    entities: Task[],
    options?: PaginationOptions,
  ): Task[] {
    const limit = options?.limit ?? 10;
    const offset = options?.offset ?? 0;

    return entities.slice(offset, offset + limit);
  }
}
