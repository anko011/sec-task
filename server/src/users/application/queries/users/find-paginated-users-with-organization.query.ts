import { IQuery } from '@nestjs/cqrs';
import { PaginationOptions } from '../../../../common/queries';
import { FindPaginatedUsersQuery } from '~/users/application/queries/users/find-paginated-users.query';

type Where = FindPaginatedUsersQuery['where'] & { organizationName?: string };

export class FindPaginatedUsersWithOrganizationQuery implements IQuery {
  constructor(
    readonly where?: Omit<Where, 'organizationId'>,
    readonly options?: PaginationOptions,
  ) {}
}
