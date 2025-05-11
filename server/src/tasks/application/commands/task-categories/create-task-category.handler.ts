import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateTaskCategoryCommand } from './create-task-category.command';
import { TaskCategoriesPort } from '../../ports';
import { TaskCategoryFactory } from '../../factories';
import { TaskCategory } from '../../entities';

@CommandHandler(CreateTaskCategoryCommand)
export class CreateTaskCategoryCommandHandler
  implements ICommandHandler<CreateTaskCategoryCommand>
{
  constructor(
    private readonly taskCategoriesPort: TaskCategoriesPort,
    private readonly taskCategoryFactory: TaskCategoryFactory,
  ) {}

  public async execute({
    dto,
  }: CreateTaskCategoryCommand): Promise<TaskCategory> {
    const taskCategory = this.taskCategoryFactory.create(dto);
    await this.taskCategoriesPort.save(taskCategory);
    return taskCategory;
  }
}
