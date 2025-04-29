import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateTaskCommand } from './update-task.command';
import { TaskPackagesPort } from '../../ports';
import { Task, TaskPackage } from '../../entities';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskCommandHandler
  implements ICommandHandler<UpdateTaskCommand>
{
  public constructor(private readonly taskPackagesPort: TaskPackagesPort) {}

  public async execute({ dto }: UpdateTaskCommand): Promise<Task> {
    const taskPackage: TaskPackage | null = await this.taskPackagesPort.find(
      dto.packageId,
    );
    if (!taskPackage)
      throw new NotFoundException(
        `Task package with id ${dto.packageId} not found`,
      );

    const task: Task | null = taskPackage.findTask(dto.id);
    if (!task) throw new NotFoundException(`Task with id ${dto.id} not found`);

    task.update(dto);

    await this.taskPackagesPort.save(taskPackage);

    return task;
  }
}
