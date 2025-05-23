import { IQuery } from '@nestjs/cqrs';

import { PaginationOptions } from '../../../../common/queries';

export class FindPaginatedTaskNamesQuery implements IQuery {
  constructor(
    readonly where?: {
      readonly title?: string;
    },
    readonly options?: PaginationOptions,
  ) {}
}
