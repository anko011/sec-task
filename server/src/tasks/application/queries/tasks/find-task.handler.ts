import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { Task, TaskPackage } from '../../entities/';

import { FindTaskQuery } from './find-task.query';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';

@QueryHandler(FindTaskQuery)
export class FindTaskQueryHandler implements IQueryHandler<FindTaskQuery> {
  public constructor(
    @InjectRepository(TaskPackage)
    private readonly taskPackagesRepository: EntityRepository<TaskPackage>,
  ) {}

  public async execute({ id, packageId }: FindTaskQuery): Promise<Task> {
    const taskPackage = await this.taskPackagesRepository.findOne({
      id: packageId,
    });

    if (!taskPackage)
      throw new NotFoundException(
        `Not found task package with id ${packageId}`,
      );

    const task = taskPackage.tasks.find((task) => task.id === id);

    if (!task)
      throw new NotFoundException(`Not found task package with id ${id}`);

    return task;
  }
}
