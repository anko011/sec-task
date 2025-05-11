import { IQuery } from '@nestjs/cqrs';
import { OrganizationTypeFilterCriteria } from '../../ports';
import { PaginationOptions } from '../../../../common/queries';

export class FindPaginatedOrganizationTypesQuery implements IQuery {
  constructor(
    public readonly where?: OrganizationTypeFilterCriteria,
    public readonly options?: PaginationOptions,
  ) {}
}
