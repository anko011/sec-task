import { IQuery } from '@nestjs/cqrs';

import { PaginationOptions } from '../../../../common/queries';

export class FindPaginatedOrganizationsQuery implements IQuery {
  constructor(
    public readonly where?: {
      typeId?: string;
      name?: string;
      isArchived?: boolean;
    },
    public readonly options?: PaginationOptions,
  ) {}
}
