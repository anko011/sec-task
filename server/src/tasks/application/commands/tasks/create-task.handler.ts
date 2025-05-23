import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Task, TaskPackage } from '../../entities';

import { CreateTaskCommand } from './create-task.command';

@CommandHandler(CreateTaskCommand)
export class CreateTaskCommandHandler
  implements ICommandHandler<CreateTaskCommand>
{
  constructor(
    @InjectRepository(TaskPackage)
    private readonly taskPackageRepository: EntityRepository<TaskPackage>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({ packageId, dto }: CreateTaskCommand): Promise<Task> {
    const taskPackage = await this.findTaskPackageOrFail(packageId);
    const task = taskPackage.addTask(
      dto,
      taskPackage.organizations.getIdentifiers(),
    );
    await this.flushChanges(taskPackage);

    return task;
  }

  private async findTaskPackageOrFail(id: string): Promise<TaskPackage> {
    const taskPackage = await this.taskPackageRepository.findOne(
      { id },
      { populate: ['*'] },
    );

    if (!taskPackage) {
      throw new NotFoundException(`Task package with id ${id} not found`);
    }

    return taskPackage;
  }

  private async flushChanges(taskPackage: TaskPackage): Promise<void> {
    try {
      await this.entityManager.persistAndFlush(taskPackage);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to save task package changes: ${error.message}`,
      );
    }
  }
}
