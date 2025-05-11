import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTaskExecutionQuery } from './find-task-execution.query';
import { TaskExecution } from '../../entities';
import { TaskPackagesPort } from '../../ports';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(FindTaskExecutionQuery)
export class FindTaskExecutionQueryHandler
  implements IQueryHandler<FindTaskExecutionQuery>
{
  constructor(private readonly taskPackagesPort: TaskPackagesPort) {}

  async execute({
    packageId,
    taskId,
    organizationId,
  }: FindTaskExecutionQuery): Promise<TaskExecution[]> {
    const taskPackages = await this.taskPackagesPort.find({ id: packageId });
    if (taskPackages.length !== 1)
      throw new NotFoundException(
        `Task package with id ${packageId} not found.`,
      );

    const taskPackage = taskPackages[0];

    return taskPackage.taskExecutions.filter((execution) => {
      const taskMatch = execution.taskId === taskId;
      const organizationMatch =
        organizationId != null
          ? execution.organizationId === organizationId
          : true;
      return taskMatch && organizationMatch;
    });
  }
}
