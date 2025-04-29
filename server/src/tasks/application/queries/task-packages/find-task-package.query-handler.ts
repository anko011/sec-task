import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTaskPackageQuery } from './find-task-package.query';
import { TaskPackagesPort } from '../../ports';
import { TaskPackage } from '../../entities/task-package';

@QueryHandler(FindTaskPackageQuery)
export class FindTaskPackageQueryHandler
  implements IQueryHandler<FindTaskPackageQuery>
{
  public constructor(
    private readonly taskPackagesRepository: TaskPackagesPort,
  ) {}

  public async execute({
    id,
  }: FindTaskPackageQuery): Promise<TaskPackage | null> {
    return this.taskPackagesRepository.find(id);
  }
}
