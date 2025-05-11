import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateTaskCommand } from './create-task.command';
import {
  TaskCategoriesPort,
  TaskNamesPort,
  TaskPackagesPort,
} from '../../ports';
import { Task } from '../../entities/task-package';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateTaskCommand)
export class CreateTaskCommandHandler
  implements ICommandHandler<CreateTaskCommand>
{
  public constructor(
    private readonly taskPackagesPort: TaskPackagesPort,
    private readonly taskCategoriesPort: TaskCategoriesPort,
    private readonly taskNamesPort: TaskNamesPort,
  ) {}

  public async execute({ packageId, dto }: CreateTaskCommand): Promise<Task> {
    const packages = await this.taskPackagesPort.find({ id: packageId });

    if (packages.length !== 1)
      throw new BadRequestException(`Package ${packageId} not found`);

    const taskPackage = packages[0];

    const taskCategories = await this.taskCategoriesPort.find({
      id: dto.categoryId,
    });

    if (taskCategories.length !== 1)
      throw new BadRequestException(
        `Task category ${dto.categoryId} not found`,
      );

    const taskNames = await this.taskNamesPort.find({
      id: dto.nameId,
    });

    if (taskNames.length !== 1)
      throw new BadRequestException(`Task name ${dto.nameId} not found`);

    const task = taskPackage.addTask({
      ...dto,
      category: taskCategories[0],
      name: taskNames[0],
    });
    await this.taskPackagesPort.save(taskPackage);
    return task;
  }
}
