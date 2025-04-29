import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTaskQuery } from './find-task.query';
import { TaskPackagesPort } from '../../ports';
import { Task } from '../../entities';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(FindTaskQuery)
export class FindTaskQueryHandler implements IQueryHandler<FindTaskQuery> {
  public constructor(
    private readonly taskPackagesRepository: TaskPackagesPort,
  ) {}

  public async execute({ taskId, packageId }: FindTaskQuery): Promise<Task> {
    const taskPackage = await this.taskPackagesRepository.find(packageId);
    if (!taskPackage)
      throw new NotFoundException(`TaskPackage ${packageId} not found`);

    const task = taskPackage.findTask(taskId);
    if (!task) throw new NotFoundException(`Task ${taskId} not found`);

    return task;
  }
}
