import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';

import { TaskPackagesPort } from '../../ports';

import { ChangeTaskStatusCommand } from './change-task-status.command';

@CommandHandler(ChangeTaskStatusCommand)
export class ChangeTaskStatusCommandHandler
  implements ICommandHandler<ChangeTaskStatusCommand>
{
  constructor(private readonly taskPackagesPort: TaskPackagesPort) {}

  async execute({ packageId, taskId, dto }: ChangeTaskStatusCommand) {
    const taskPackages = await this.taskPackagesPort.find({ id: packageId });
    if (taskPackages.length !== 1)
      throw new BadRequestException(
        `Not fount task package with id ${packageId}`,
      );

    const taskPackage = taskPackages[0];

    const execution = taskPackage.changeTaskStatus(
      taskId,
      dto.organizationId,
      dto.status,
      dto.comment,
    );

    await this.taskPackagesPort.save(taskPackage);
    return execution;
  }
}
