import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  EntityManager,
  EntityRepository,
  ForeignKeyConstraintViolationException,
} from '@mikro-orm/better-sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';

import { TaskCategory } from '../../entities';

import { DeleteTaskCategoryCommand } from './delete-task-category.command';

@CommandHandler(DeleteTaskCategoryCommand)
export class DeleteTaskCategoryCommandHandler
  implements ICommandHandler<DeleteTaskCategoryCommand>
{
  public constructor(
    @InjectRepository(TaskCategory)
    private readonly taskCategoriesRepository: EntityRepository<TaskCategory>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({ id }: DeleteTaskCategoryCommand): Promise<void> {
    const taskCategory = await this.taskCategoriesRepository.findOne({
      id,
    });

    if (!taskCategory)
      throw new NotFoundException(`Task category  with id ${id} not found`);

    try {
      await this.entityManager.removeAndFlush(taskCategory);
    } catch (e) {
      if (e instanceof ForeignKeyConstraintViolationException) {
        throw new ConflictException(
          `Cannot delete the task category  with id ${id} because it is referenced by other entities.`,
        );
      }

      throw e;
    }
  }
}
