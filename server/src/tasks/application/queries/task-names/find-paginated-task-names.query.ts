import { IQuery } from '@nestjs/cqrs';

import { PaginationOptions } from '../../../../common/queries';
import { TaskNameFilterCriteria } from '../../entities';

export class FindPaginatedTaskNamesQuery implements IQuery {
  public constructor(
    public readonly where?: TaskNameFilterCriteria,
    public readonly options?: PaginationOptions,
  ) {}
}
