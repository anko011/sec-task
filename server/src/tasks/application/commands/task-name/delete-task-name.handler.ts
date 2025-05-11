import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TaskNamesPort } from '../../ports';

import { DeleteTaskNameCommand } from './delete-task-name.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteTaskNameCommand)
export class DeleteTaskNameCommandHandler
  implements ICommandHandler<DeleteTaskNameCommand>
{
  public constructor(private readonly taskNamesPort: TaskNamesPort) {}

  public async execute({ id }: DeleteTaskNameCommand): Promise<void> {
    const taskNames = await this.taskNamesPort.find({ id });
    if (taskNames.length !== 1)
      throw new NotFoundException(`Task name ${id} not found`);
    const taskName = taskNames[0];

    await this.taskNamesPort.delete(taskName);
  }
}
