import { ICommand } from '@nestjs/cqrs';

export class SignUpCommand implements ICommand {
  constructor(
    readonly props: {
      readonly firstName: string;
      readonly secondName: string;
      readonly patronymic: string;
      readonly email: string;
      readonly password: string;
      readonly organizationId: string;
    },
  ) {}
}
