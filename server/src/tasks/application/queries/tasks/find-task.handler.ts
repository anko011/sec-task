import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { TaskPackagesPort } from '../../ports';
import { Task } from '../../entities/task-package';

import { FindTaskQuery } from './find-task.query';

@QueryHandler(FindTaskQuery)
export class FindTaskQueryHandler implements IQueryHandler<FindTaskQuery> {
  public constructor(
    private readonly taskPackagesRepository: TaskPackagesPort,
  ) {}

  public async execute({ id }: FindTaskQuery): Promise<Task> {
    const taskPackages = await this.taskPackagesRepository.find({ id });
    if (taskPackages.length !== 1)
      throw new NotFoundException(`Not found task packages with id ${id}`);

    const taskPackage = taskPackages[0];

    const task = taskPackage.tasks.find((task) => task.id === id);
    if (!task)
      throw new NotFoundException(`Not found task package with id ${id}`);

    return task;
  }
}
