import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { TaskPackagesPort } from '../../ports';
import { TaskPackage } from '../../entities/task-package';

import { FindTaskPackageQuery } from './find-task-package.query';

@QueryHandler(FindTaskPackageQuery)
export class FindTaskPackageQueryHandler
  implements IQueryHandler<FindTaskPackageQuery>
{
  public constructor(
    private readonly taskPackagesRepository: TaskPackagesPort,
  ) {}

  public async execute({ id }: FindTaskPackageQuery): Promise<TaskPackage> {
    const taskPackages = await this.taskPackagesRepository.find({ id });
    if (taskPackages.length !== 1)
      throw new NotFoundException(`Not found task packages with id ${id}`);

    return taskPackages[0];
  }
}
