import { IQuery } from '@nestjs/cqrs';
import { Role } from '../../entities';

export class FindPaginatedUsersQuery implements IQuery {
  public constructor(
    public readonly where?: {
      readonly firstName?: string;
      readonly secondName?: string;
      readonly patronymic?: string;
      readonly email?: string;
      readonly role?: Role;
      readonly password?: string;
    },
    public readonly options?: {
      readonly limit?: number;
      readonly offset?: number;
    },
  ) {}
}
