import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { TaskPackagesPort } from '../../ports';

import { DeleteTaskCommand } from './delete-task.command';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskCommandHandler
  implements ICommandHandler<DeleteTaskCommand>
{
  public constructor(private readonly taskPackagesPort: TaskPackagesPort) {}

  public async execute({ packageId, id }: DeleteTaskCommand): Promise<void> {
    const taskPackages = await this.taskPackagesPort.find({
      id: packageId,
    });

    if (taskPackages.length !== 1)
      throw new NotFoundException(`TaskPackage ${id} not found`);

    const taskPackage = taskPackages[0];
    taskPackage.removeTask(id);

    await this.taskPackagesPort.save(taskPackage);
  }
}
