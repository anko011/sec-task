import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  ForeignKeyConstraintViolationException,
} from '@mikro-orm/better-sqlite';

import { TaskPackage } from '../../entities';

import { DeleteTaskCommand } from './delete-task.command';
import { ConflictException, NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskCommandHandler
  implements ICommandHandler<DeleteTaskCommand>
{
  public constructor(
    @InjectRepository(TaskPackage)
    private readonly taskPackagesRepository: EntityRepository<TaskPackage>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({ packageId, id }: DeleteTaskCommand): Promise<void> {
    const taskPackage = await this.taskPackagesRepository.findOne(
      {
        id: packageId,
      },
      { populate: ['*'] },
    );

    if (!taskPackage)
      throw new NotFoundException(
        `Task package with id ${id} not found inside task package with id ${packageId}`,
      );

    taskPackage.removeTask(id);

    try {
      await this.entityManager.persistAndFlush(taskPackage);
    } catch (e) {
      if (e instanceof ForeignKeyConstraintViolationException) {
        throw new ConflictException(
          `Cannot delete the task  with id ${id} because it is referenced by other entities.`,
        );
      }

      throw e;
    }
  }
}
