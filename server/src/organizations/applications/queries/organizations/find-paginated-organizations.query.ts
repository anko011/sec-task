import { IQuery } from '@nestjs/cqrs';

import { PaginationOptions } from '../../../../common/queries';

import { OrganizationFilterCriteria } from '../../ports';

export class FindPaginatedOrganizationsQuery implements IQuery {
  constructor(
    public readonly where?: Omit<OrganizationFilterCriteria, 'type'> & {
      typeId?: string;
    },
    public readonly options?: PaginationOptions,
  ) {}
}
