import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';

import { TaskName } from '../../entities';

import { FindTaskNameQuery } from './find-task-name.query';

@QueryHandler(FindTaskNameQuery)
export class FindTaskNameHandler implements IQueryHandler<FindTaskNameQuery> {
  public constructor(
    @InjectRepository(TaskName)
    private readonly taskNamesRepository: EntityRepository<TaskName>,
  ) {}

  public async execute({ id }: FindTaskNameQuery): Promise<TaskName> {
    const taskName = await this.taskNamesRepository.findOne({ id });

    if (!taskName)
      throw new NotFoundException(`Not found task name with id ${id}`);

    return taskName;
  }
}
