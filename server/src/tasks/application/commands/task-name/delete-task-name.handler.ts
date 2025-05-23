import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  EntityManager,
  EntityRepository,
  ForeignKeyConstraintViolationException,
} from '@mikro-orm/better-sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';

import { TaskName } from '../../entities';

import { DeleteTaskNameCommand } from './delete-task-name.command';

@CommandHandler(DeleteTaskNameCommand)
export class DeleteTaskNameCommandHandler
  implements ICommandHandler<DeleteTaskNameCommand>
{
  public constructor(
    @InjectRepository(TaskName)
    private readonly taskNamesRepository: EntityRepository<TaskName>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({ id }: DeleteTaskNameCommand): Promise<void> {
    const taskName = await this.taskNamesRepository.findOne({
      id,
    });
    if (!taskName)
      throw new NotFoundException(`Task name  with id ${id} not found`);
    try {
      await this.entityManager.removeAndFlush(taskName);
    } catch (e) {
      if (e instanceof ForeignKeyConstraintViolationException) {
        throw new ConflictException(
          `Cannot delete the task name  with id ${id} because it is referenced by other entities.`,
        );
      }

      throw e;
    }
  }
}
