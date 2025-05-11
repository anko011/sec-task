import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';

import {
  TaskCategoriesPort,
  TaskNamesPort,
  TaskPackagesPort,
} from '../../ports';
import { Task } from '../../entities';

import { UpdateTaskCommand } from './update-task.command';

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskCommandHandler
  implements ICommandHandler<UpdateTaskCommand>
{
  public constructor(
    private readonly taskPackagesPort: TaskPackagesPort,
    private readonly taskCategoriesPort: TaskCategoriesPort,
    private readonly taskNamesPort: TaskNamesPort,
  ) {}

  public async execute({ packageId, dto }: UpdateTaskCommand): Promise<Task> {
    const taskPackages = await this.taskPackagesPort.find({ id: packageId });

    if (taskPackages.length !== 1)
      throw new BadRequestException(`Task package with id ${dto.id} not found`);

    const taskPackage = taskPackages[0];

    const category = (
      await this.taskCategoriesPort.find({ id: dto.categoryId })
    ).at(0);

    const name = (await this.taskNamesPort.find({ id: dto.nameId })).at(0);

    const task = taskPackage.updateTask({ ...dto, category, name });

    await this.taskPackagesPort.save(taskPackage);
    return task;
  }
}
