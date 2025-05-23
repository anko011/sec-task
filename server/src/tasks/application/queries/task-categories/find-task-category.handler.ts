import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { FindTaskCategoryQuery } from './find-task-category.query';
import { TaskCategory } from '../../entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';

@QueryHandler(FindTaskCategoryQuery)
export class FindTaskCategoryHandler
  implements IQueryHandler<FindTaskCategoryQuery>
{
  public constructor(
    @InjectRepository(TaskCategory)
    private readonly taskCategoryRepository: EntityRepository<TaskCategory>,
  ) {}

  public async execute({ id }: FindTaskCategoryQuery): Promise<TaskCategory> {
    const taskCategory = await this.taskCategoryRepository.findOne({ id });
    if (!taskCategory)
      throw new NotFoundException(`Not found task category with id ${id}`);

    return taskCategory;
  }
}
