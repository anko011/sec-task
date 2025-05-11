import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TaskNamesPort } from '../../ports';

import { UpdateTaskNameCommand } from './update-task-name.command';
import { BadRequestException } from '@nestjs/common';
import { TaskName } from '../../entities';

@CommandHandler(UpdateTaskNameCommand)
export class UpdateTaskNameCommandHandler
  implements ICommandHandler<UpdateTaskNameCommand>
{
  public constructor(private readonly taskNamesPort: TaskNamesPort) {}

  public async execute({ dto }: UpdateTaskNameCommand): Promise<TaskName> {
    const taskNames = await this.taskNamesPort.find({ id: dto.id });
    if (taskNames.length !== 1)
      throw new BadRequestException(`Task name ${dto.id} not found.`);
    const taskName = taskNames[0];

    taskName.update(dto);

    await this.taskNamesPort.save(taskName);
    return taskName;
  }
}
