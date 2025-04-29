import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TaskPackagesPort } from '../../ports';
import { TaskPackage } from '../../entities';

import { UpdateTaskPackageCommand } from './update-task-package.command';

@CommandHandler(UpdateTaskPackageCommand)
export class UpdateTaskPackageCommandHandler
  implements ICommandHandler<UpdateTaskPackageCommand>
{
  public constructor(private readonly taskPackagesPort: TaskPackagesPort) {}

  public async execute({
    dto,
  }: UpdateTaskPackageCommand): Promise<TaskPackage> {
    return await this.taskPackagesPort.update(dto);
  }
}
