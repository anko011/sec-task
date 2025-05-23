import { IQuery } from '@nestjs/cqrs';

import { PaginationOptions } from '../../../../common/queries';
import { TaskPackageStatus } from '~/tasks/application/entities';

export class FindPaginatedTaskPackagesQuery implements IQuery {
  constructor(
    readonly refreshToken?: string,
    readonly where?: {
      readonly incomingRequisite?: string;
      readonly outgoingRequisite?: string;
      readonly status?: TaskPackageStatus;
    },
    readonly options?: PaginationOptions,
  ) {}
}
