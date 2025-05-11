import { ICommand } from '@nestjs/cqrs';

import { Role } from '../../entities';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly dto: {
      readonly id: string;
      readonly firstName?: string;
      readonly secondName?: string;
      readonly patronymic?: string;
      readonly email?: string;
      readonly role?: Role;
    },
  ) {}
}
