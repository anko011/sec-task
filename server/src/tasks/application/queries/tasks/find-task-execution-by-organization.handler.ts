import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';

import { TaskExecution, TaskPackage } from '../../entities';

import { FindTaskExecutionByOrganizationQuery } from './find-task-execution-by-organization.query';

@QueryHandler(FindTaskExecutionByOrganizationQuery)
export class FindTaskExecutionByOrganizationQueryHandler
  implements IQueryHandler<FindTaskExecutionByOrganizationQuery>
{
  constructor(
    @InjectRepository(TaskPackage)
    private readonly taskPackagesRepository: EntityRepository<TaskPackage>,
  ) {}

  async execute({
    packageId,
    taskId,
    organizationId,
  }: FindTaskExecutionByOrganizationQuery): Promise<TaskExecution> {
    const taskPackage = await this.taskPackagesRepository.findOne(
      {
        id: packageId,
        tasks: { id: taskId },
        organizations: { id: organizationId },
      },
      { populate: ['tasks.executions.organization.name'] },
    );

    if (!taskPackage)
      throw new NotFoundException(
        `Task package with id ${packageId} not found.`,
      );

    const task = taskPackage.tasks.find((t) => t.id === taskId);

    if (!task) throw new NotFoundException(`Task with ${taskId} not found`);

    const execution = task.executions.find(
      (t) => t.organization.id === organizationId,
    );

    if (!execution)
      throw new NotFoundException(
        `Execution for task with ${taskId} and organizationId ${organizationId} not found`,
      );

    return execution;
  }
}
