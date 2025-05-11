import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { TaskNamesPort } from '../../ports';

import { FindTaskNameQuery } from './find-task-name.query';
import { TaskName } from '../../entities';

@QueryHandler(FindTaskNameQuery)
export class FindTaskNameHandler implements IQueryHandler<FindTaskNameQuery> {
  public constructor(private readonly taskNamesPort: TaskNamesPort) {}

  public async execute({ id }: FindTaskNameQuery): Promise<TaskName> {
    const taskNames = await this.taskNamesPort.find({ id });
    if (taskNames.length !== 1)
      throw new NotFoundException(`Not found task name with id ${id}`);

    return taskNames[0];
  }
}
