import { IQuery } from '@nestjs/cqrs';
import { PaginationOptions } from '../../../../common/queries';
import { UserFilterCriteria } from '../../ports/users.port';

export class FindPaginatedUsersQuery implements IQuery {
  public constructor(
    public readonly where?: UserFilterCriteria,
    public readonly options?: PaginationOptions,
  ) {}
}
