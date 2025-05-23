import { IQuery } from '@nestjs/cqrs';

import { PaginationOptions } from '../../../../common/queries';

export class FindPaginatedOrganizationsQuery implements IQuery {
  constructor(
    readonly packageId: string,
    readonly where?: {
      typeId?: string;
      name?: string;
      isArchived?: boolean;
    },
    readonly options?: PaginationOptions,
  ) {}
}
