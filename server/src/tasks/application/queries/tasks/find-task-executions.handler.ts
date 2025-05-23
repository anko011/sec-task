import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';

import { TaskExecution, TaskPackage } from '../../entities';
import { FindTaskExecutionsQuery } from './find-task-executions.query';

@QueryHandler(FindTaskExecutionsQuery)
export class FindTaskExecutionQueryHandler
  implements IQueryHandler<FindTaskExecutionsQuery>
{
  constructor(
    @InjectRepository(TaskPackage)
    private readonly taskPackagesRepository: EntityRepository<TaskPackage>,
  ) {}

  async execute({
    packageId,
    taskId,
  }: FindTaskExecutionsQuery): Promise<TaskExecution[]> {
    const taskPackage = await this.taskPackagesRepository.findOne(
      { id: packageId, tasks: { id: taskId } },
      { populate: ['tasks.executions.id', 'tasks.executions.organization.id'] },
    );

    if (!taskPackage)
      throw new NotFoundException(
        `Task package with id ${packageId} not found.`,
      );

    const task = taskPackage.tasks.find((t) => t.id === taskId);
    if (!task) throw new NotFoundException(`Task with ${taskId} not found`);
    const executions = await task.executions.loadItems({ refresh: true });
    if (!executions) throw new InternalServerErrorException();
    return executions;
  }
}
