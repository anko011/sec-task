import { IQuery } from '@nestjs/cqrs';

import { PaginationOptions } from '../../../../common/queries';

import { TaskPackageFilterCriteria } from '../../ports';

export class FindPaginatedTaskPackagesQuery implements IQuery {
  public constructor(
    public readonly where?: TaskPackageFilterCriteria,
    public readonly options?: PaginationOptions,
  ) {}
}
