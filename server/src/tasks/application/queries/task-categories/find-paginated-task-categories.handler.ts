import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';

import { Paginated, prepareSearchConditions } from '~/common/queries';

import { TaskCategory } from '../../entities';

import { FindPaginatedTaskCategoriesQuery } from './find-paginated-task-categories.query';

@QueryHandler(FindPaginatedTaskCategoriesQuery)
export class FindPaginatedTaskCategoriesHandler
  implements IQueryHandler<FindPaginatedTaskCategoriesQuery>
{
  constructor(
    @InjectRepository(TaskCategory)
    private readonly taskCategoriesRepository: EntityRepository<TaskCategory>,
  ) {}

  async execute({
    where,
    options,
  }: FindPaginatedTaskCategoriesQuery): Promise<Paginated<TaskCategory[]>> {
    const [items, total] = await this.taskCategoriesRepository.findAndCount(
      prepareSearchConditions({ ...where }, { exactMatchFields: ['color'] }),
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
