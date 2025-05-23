import { ICommand } from '@nestjs/cqrs';

import { Role } from '../../entities';

export class CreateUserCommand implements ICommand {
  constructor(
    public readonly dto: {
      readonly firstName: string;
      readonly secondName: string;
      readonly patronymic: string;
      readonly email: string;
      readonly role: Role;
      readonly password: string;
      readonly organizationId?: string;
    },
  ) {}
}
