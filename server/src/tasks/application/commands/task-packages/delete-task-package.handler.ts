import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { TaskPackagesPort } from '../../ports';

import { DeleteTaskPackageCommand } from './delete-task-package.command';

@CommandHandler(DeleteTaskPackageCommand)
export class DeleteTaskPackageCommandHandler
  implements ICommandHandler<DeleteTaskPackageCommand>
{
  public constructor(private readonly taskPackagesPort: TaskPackagesPort) {}

  public async execute({ id }: DeleteTaskPackageCommand): Promise<void> {
    const taskPackages = await this.taskPackagesPort.find({
      id,
    });

    if (taskPackages.length !== 1)
      throw new NotFoundException(`TaskPackage ${id} not found`);

    await this.taskPackagesPort.delete(taskPackages[0]);
  }
}
