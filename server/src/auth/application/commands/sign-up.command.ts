import { ICommand } from '@nestjs/cqrs';

export class SignUpCommand implements ICommand {
  public constructor(
    public readonly props: {
      readonly firstName: string;
      readonly secondName: string;
      readonly patronymic: string;
      readonly email: string;
      readonly password: string;
    },
  ) {}
}
