import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateTaskNameCommand } from './create-task-name.command';
import { TaskNamesPort } from '../../ports';
import { TaskNameFactory } from '../../factories';
import { TaskName } from '../../entities';

@CommandHandler(CreateTaskNameCommand)
export class CreateTaskNameCommandHandler
  implements ICommandHandler<CreateTaskNameCommand>
{
  constructor(
    private readonly taskNamesPort: TaskNamesPort,
    private readonly taskNameFactory: TaskNameFactory,
  ) {}

  public async execute({ dto }: CreateTaskNameCommand): Promise<TaskName> {
    const taskName = this.taskNameFactory.create(dto);
    await this.taskNamesPort.save(taskName);
    return taskName;
  }
}
