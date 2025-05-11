import { IQuery } from '@nestjs/cqrs';

import { PaginationOptions } from '../../../../common/queries';
import { TaskFilterCriteria } from '../../entities/task-package';

export class FindPaginatedTasksQuery implements IQuery {
  public constructor(
    public readonly packageId: string,
    public readonly where?: TaskFilterCriteria,
    public readonly options?: PaginationOptions,
  ) {}
}
