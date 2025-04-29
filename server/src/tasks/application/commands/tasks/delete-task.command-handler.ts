import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTaskCommand } from './delete-task.command';
import { TaskPackagesPort } from '../../ports';
import { Task, TaskPackage } from '../../entities';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskCommandHandler
  implements ICommandHandler<DeleteTaskCommand>
{
  public constructor(private readonly taskPackagesPort: TaskPackagesPort) {}

  public async execute({ packageId, taskId }: DeleteTaskCommand) {
    const taskPackage: TaskPackage | null =
      await this.taskPackagesPort.find(packageId);

    if (!taskPackage)
      throw new NotFoundException(`Task package ${packageId} not found`);

    const task: Task | null = taskPackage.findTask(taskId);

    if (!task) throw new NotFoundException(`Task ${taskId} not found`);

    taskPackage.removeTask(taskId);
    await this.taskPackagesPort.save(taskPackage);
  }
}
