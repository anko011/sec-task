import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTaskPackageCommand } from './delete-task-package.command';
import { TaskPackagesPort } from '../../ports';
import { TaskPackage } from '../../entities';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteTaskPackageCommand)
export class DeleteTaskPackageCommandHandler
  implements ICommandHandler<DeleteTaskPackageCommand>
{
  public constructor(private readonly taskPackagesPort: TaskPackagesPort) {}

  public async execute({ id }: DeleteTaskPackageCommand): Promise<void> {
    const taskPackage: TaskPackage | null =
      await this.taskPackagesPort.find(id);

    if (!taskPackage)
      throw new NotFoundException(`TaskPackage ${id} not found`);

    await this.taskPackagesPort.delete(taskPackage);
  }
}
