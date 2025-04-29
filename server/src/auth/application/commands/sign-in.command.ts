import { ICommand } from '@nestjs/cqrs';

export class SignInCommand implements ICommand {
  public constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
