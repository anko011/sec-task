import { IQuery } from '@nestjs/cqrs';

import { PaginationOptions } from '../../../../common/queries';
import { TaskCategoryFilterCriteria } from '../../entities';

export class FindPaginatedTaskCategoriesQuery implements IQuery {
  public constructor(
    public readonly where?: TaskCategoryFilterCriteria,
    public readonly options?: PaginationOptions,
  ) {}
}
