import { IQuery } from '@nestjs/cqrs';
import { PaginationOptions } from '../../../../common/queries';
import { Role } from '~/users/application/entities';

export class FindPaginatedUsersQuery implements IQuery {
  constructor(
    readonly where?: {
      firstName?: string;
      secondName?: string;
      patronymic?: string;
      organizationId?: string;
      email?: string;
      role?: Role;
    },
    readonly options?: PaginationOptions,
  ) {}
}
