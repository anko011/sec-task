import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { TaskCategoriesPort, TaskPackagesPort } from '../../ports';
import { Task, TaskCategory, TaskPackage } from '../../entities';

import { CreateTaskCommand } from './create-task.command';

@CommandHandler(CreateTaskCommand)
export class CreateTaskCommandHandler
  implements ICommandHandler<CreateTaskCommand>
{
  public constructor(
    private readonly taskPackagesPort: TaskPackagesPort,
    private readonly taskCategoriesPort: TaskCategoriesPort,
  ) {}

  public async execute({ dto }: CreateTaskCommand): Promise<Task> {
    const taskPackage: TaskPackage | null = await this.taskPackagesPort.find(
      dto.packageId,
    );

    if (!taskPackage)
      throw new NotFoundException(`TaskPackage ${dto.packageId} doesn't exist`);

    const category: TaskCategory | null = await this.taskCategoriesPort.find(
      dto.categoryId,
    );

    if (!category)
      throw new NotFoundException(
        `TaskCategory ${dto.categoryId} doesn't exist`,
      );

    const task = taskPackage.addTask({ ...dto, category });

    await this.taskPackagesPort.save(taskPackage);
    return task;
  }
}
