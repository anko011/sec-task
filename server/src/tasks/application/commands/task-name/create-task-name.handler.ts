import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';

import { TaskName } from '../../entities';

import { CreateTaskNameCommand } from './create-task-name.command';

@CommandHandler(CreateTaskNameCommand)
export class CreateTaskNameCommandHandler
  implements ICommandHandler<CreateTaskNameCommand>
{
  constructor(
    @InjectRepository(TaskName)
    private readonly taskNamesRepository: EntityRepository<TaskName>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({ dto }: CreateTaskNameCommand): Promise<TaskName> {
    const taskName = this.taskNamesRepository.create(dto);
    await this.entityManager.persistAndFlush(taskName);
    return taskName;
  }
}
