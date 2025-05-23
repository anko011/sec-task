import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Task, TaskPackage } from '../../entities/';
import { Paginated, prepareSearchConditions } from '../../../../common/queries';

import { FindPaginatedTasksQuery } from './find-paginated-tasks.query';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';

@QueryHandler(FindPaginatedTasksQuery)
export class FindPaginatedTasksQueryHandler
  implements IQueryHandler<FindPaginatedTasksQuery>
{
  constructor(
    @InjectRepository(TaskPackage)
    private readonly taskPackagesRepository: EntityRepository<TaskPackage>,
  ) {}

  async execute({
    packageId,
    where,
    options,
  }: FindPaginatedTasksQuery): Promise<Paginated<Task[]>> {
    const taskPackage = await this.taskPackagesRepository.findOne({
      id: packageId,
    });

    if (!taskPackage)
      throw new NotFoundException(
        `Task package with id ${packageId} not found`,
      );

    const limit = options?.limit ?? 10;
    const offset = options?.offset ?? 0;

    const conditions = prepareSearchConditions({
      name: where?.nameId,
      category: where?.categoryId,
      number: where?.number,
      dangerStatus: where?.dangerStatus,
    });

    const [items, total] = await Promise.all([
      taskPackage.tasks.matching({
        where: conditions,
        populate: ['category', 'name'],
        limit,
        offset,
      }),
      taskPackage.tasks.loadCount({ where: conditions }),
    ]);

    return {
      items,
      total,
      limit,
      offset,
    };
  }
}
