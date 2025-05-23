import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';

import { deepCleanObject } from '~/common/utils';

import { TaskCategory } from '../../entities';

import { UpdateTaskCategoryCommand } from './update-task-category.command';

@CommandHandler(UpdateTaskCategoryCommand)
export class UpdateTaskCategoryCommandHandler
  implements ICommandHandler<UpdateTaskCategoryCommand>
{
  public constructor(
    @InjectRepository(TaskCategory)
    private readonly taskCategoriesRepository: EntityRepository<TaskCategory>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({
    id,
    dto,
  }: UpdateTaskCategoryCommand): Promise<TaskCategory> {
    const taskCategory = await this.taskCategoriesRepository.findOne({
      id,
    });

    if (!taskCategory)
      throw new BadRequestException(`Task category with id ${id} not found`);

    const updatedTaskName = this.taskCategoriesRepository.assign(
      taskCategory,
      deepCleanObject(dto),
    );

    await this.entityManager.persistAndFlush(updatedTaskName);

    return updatedTaskName;
  }
}
