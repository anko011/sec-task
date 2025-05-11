import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { TaskCategoriesPort } from '../../ports';

import { FindTaskCategoryQuery } from './find-task-category.query';
import { TaskCategory } from '../../entities';

@QueryHandler(FindTaskCategoryQuery)
export class FindTaskCategoryHandler
  implements IQueryHandler<FindTaskCategoryQuery>
{
  public constructor(private readonly taskCategoriesPort: TaskCategoriesPort) {}

  public async execute({ id }: FindTaskCategoryQuery): Promise<TaskCategory> {
    const taskCategories = await this.taskCategoriesPort.find({ id });
    if (taskCategories.length !== 1)
      throw new NotFoundException(`Not found task category with id ${id}`);

    return taskCategories[0];
  }
}
