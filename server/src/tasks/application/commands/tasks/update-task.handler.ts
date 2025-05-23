import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';

import { Task, TaskPackage } from '../../entities';

import { UpdateTaskCommand } from './update-task.command';

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskCommandHandler
  implements ICommandHandler<UpdateTaskCommand>
{
  public constructor(
    @InjectRepository(TaskPackage)
    private taskPackagesRepository: EntityRepository<TaskPackage>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({
    packageId,
    id,
    dto,
  }: UpdateTaskCommand): Promise<Task> {
    const taskPackage = await this.taskPackagesRepository.findOne(
      {
        id: packageId,
      },
      { populate: ['*'] },
    );

    if (!taskPackage)
      throw new NotFoundException(
        `Task package with id ${packageId} not found`,
      );

    const task = taskPackage.updateTask(id, dto);

    await this.entityManager.persistAndFlush(task);
    return task;
  }
}
