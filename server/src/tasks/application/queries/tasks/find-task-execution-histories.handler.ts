import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';

import { TaskPackage, TaskStatusHistory } from '../../entities';
import { FindTaskExecutionHistoriesQuery } from './find-task-execution-histories.query';

@QueryHandler(FindTaskExecutionHistoriesQuery)
export class FindTaskExecutionHistoriesQueryHandler
  implements IQueryHandler<FindTaskExecutionHistoriesQuery>
{
  constructor(
    @InjectRepository(TaskPackage)
    private readonly taskPackagesRepository: EntityRepository<TaskPackage>,
  ) {}

  async execute({
    organizationId,
    packageId,
    taskId,
  }: FindTaskExecutionHistoriesQuery): Promise<TaskStatusHistory[]> {
    const taskPackage = await this.taskPackagesRepository.findOne(
      {
        id: packageId,
        tasks: {
          id: taskId,
          executions: { organization: { id: organizationId } },
        },
      },
      {
        populate: [
          'tasks.executions.statusHistories.id',
          'tasks.executions.id',
        ],
      },
    );

    if (!taskPackage)
      throw new NotFoundException(
        `Task package with id ${packageId} not found.`,
      );

    const task = taskPackage.tasks.find((t) => t.id === taskId);
    if (!task) throw new NotFoundException(`Task with ${taskId} not found`);

    const executions = await task.executions.loadItems({ refresh: true });
    if (!executions) throw new InternalServerErrorException();

    const histories = executions
      .find((e) => e.organization.id === organizationId)
      ?.statusHistories.loadItems();
    if (!histories) throw new InternalServerErrorException();

    return histories;
  }
}
