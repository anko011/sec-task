import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';

import { TaskPackage } from '../../entities';

import { ChangeTaskStatusCommand } from './change-task-status.command';

@CommandHandler(ChangeTaskStatusCommand)
export class ChangeTaskStatusCommandHandler
  implements ICommandHandler<ChangeTaskStatusCommand>
{
  constructor(
    @InjectRepository(TaskPackage)
    private readonly taskPackagesRepository: EntityRepository<TaskPackage>,
    private readonly entityManager: EntityManager,
  ) {}

  async execute({
    packageId,
    taskId,
    organizationId,
    dto,
  }: ChangeTaskStatusCommand) {
    const taskPackage = await this.taskPackagesRepository.findOne(packageId, {
      populate: ['tasks.executions.statusHistories'],
    });
    if (!taskPackage)
      throw new NotFoundException(
        `Task package with id ${packageId} not found`,
      );

    taskPackage.updateTaskStatus(
      organizationId,
      taskId,
      dto.status,
      dto.comment,
    );

    await this.entityManager.persistAndFlush(taskPackage);
  }
}
