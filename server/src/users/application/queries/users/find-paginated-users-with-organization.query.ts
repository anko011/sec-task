import { IQuery } from '@nestjs/cqrs';
import { PaginationOptions } from '../../../../common/queries';
import { UserFilterCriteria } from '../../ports/users.port';

export class FindPaginatedUsersWithOrganizationQuery implements IQuery {
  public constructor(
    public readonly where?: Omit<UserFilterCriteria, 'organizationId'> & {
      organizationName?: string;
    },
    public readonly options?: PaginationOptions,
  ) {}
}
