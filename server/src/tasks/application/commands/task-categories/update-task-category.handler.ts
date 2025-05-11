import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TaskCategoriesPort } from '../../ports';
import { TaskCategory } from '../../entities';

import { UpdateTaskCategoryCommand } from './update-task-category.command';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(UpdateTaskCategoryCommand)
export class UpdateTaskCategoryCommandHandler
  implements ICommandHandler<UpdateTaskCategoryCommand>
{
  public constructor(private readonly taskCategoriesPort: TaskCategoriesPort) {}

  public async execute({
    dto,
  }: UpdateTaskCategoryCommand): Promise<TaskCategory> {
    const categories = await this.taskCategoriesPort.find({ id: dto.id });
    if (categories.length !== 1)
      throw new BadRequestException(`Task category ${dto.id} not found.`);
    const category = categories[0];

    category.update(dto);

    await this.taskCategoriesPort.save(category);
    return category;
  }
}
