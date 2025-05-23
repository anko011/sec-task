import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';

import { TaskPackage } from '../../entities/task-package';

import { FindTaskPackageQuery } from './find-task-package.query';

@QueryHandler(FindTaskPackageQuery)
export class FindTaskPackageQueryHandler
  implements IQueryHandler<FindTaskPackageQuery>
{
  public constructor(
    @InjectRepository(TaskPackage)
    private readonly taskPackagesRepository: EntityRepository<TaskPackage>,
  ) {}

  public async execute({ id }: FindTaskPackageQuery): Promise<TaskPackage> {
    const taskPackage = await this.taskPackagesRepository.findOne(
      { id },
      {
        populate: [
          'nearestTaskDeadline',
          'tasks',
          'organizations:ref',
          'attachments.id',
        ],
      },
    );
    if (!taskPackage)
      throw new NotFoundException(`Not found task packages with id ${id}`);

    return taskPackage as unknown as TaskPackage;
  }
}
