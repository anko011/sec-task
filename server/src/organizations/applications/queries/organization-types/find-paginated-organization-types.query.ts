import { IQuery } from '@nestjs/cqrs';
import { PaginationOptions } from '../../../../common/queries';

export class FindPaginatedOrganizationTypesQuery implements IQuery {
  constructor(
    public readonly where?: {
      title?: string;
    },
    public readonly options?: PaginationOptions,
  ) {}
}
