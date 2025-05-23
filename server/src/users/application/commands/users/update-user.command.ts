import { ICommand } from '@nestjs/cqrs';

import { Role } from '../../entities';

export class UpdateUserCommand implements ICommand {
  constructor(
    readonly id: string,
    readonly dto: {
      readonly firstName?: string;
      readonly secondName?: string;
      readonly patronymic?: string;
      readonly email?: string;
      readonly role?: Role;
      readonly password?: string;
      readonly organizationId: string;
    },
  ) {}
}
