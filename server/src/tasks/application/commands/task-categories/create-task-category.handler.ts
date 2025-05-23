import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';

import { TaskCategory } from '../../entities';

import { CreateTaskCategoryCommand } from './create-task-category.command';

@CommandHandler(CreateTaskCategoryCommand)
export class CreateTaskCategoryCommandHandler
  implements ICommandHandler<CreateTaskCategoryCommand>
{
  constructor(
    @InjectRepository(TaskCategory)
    private readonly taskCategoriesRepository: EntityRepository<TaskCategory>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({
    dto,
  }: CreateTaskCategoryCommand): Promise<TaskCategory> {
    const taskCategory = this.taskCategoriesRepository.create(dto);
    await this.entityManager.persistAndFlush(taskCategory);
    return taskCategory;
  }
}
