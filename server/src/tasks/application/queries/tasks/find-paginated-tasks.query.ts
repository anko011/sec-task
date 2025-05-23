import { IQuery } from '@nestjs/cqrs';

import { PaginationOptions } from '../../../../common/queries';
import { TaskDangerStatus } from '~/tasks/application/entities';

export class FindPaginatedTasksQuery implements IQuery {
  public constructor(
    public readonly packageId: string,
    public readonly where?: {
      nameId?: string;
      categoryId?: string;
      number?: string;
      dangerStatus?: TaskDangerStatus;
    },
    public readonly options?: PaginationOptions,
  ) {}
}
