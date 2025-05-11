import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TaskCategoriesPort } from '../../ports';

import { DeleteTaskCategoryCommand } from './delete-task-category.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteTaskCategoryCommand)
export class DeleteTaskCategoryCommandHandler
  implements ICommandHandler<DeleteTaskCategoryCommand>
{
  public constructor(private readonly taskCategoriesPort: TaskCategoriesPort) {}

  public async execute({ id }: DeleteTaskCategoryCommand): Promise<void> {
    const categories = await this.taskCategoriesPort.find({ id });
    if (categories.length !== 1)
      throw new NotFoundException(`Task category ${id} not found`);
    const category = categories[0];

    await this.taskCategoriesPort.delete(category);
  }
}
