import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { compare } from 'bcryptjs';

import { UsersPort } from '../../../users/application/ports';

import { AuthTokenPair } from '../entities';
import { JwtServicePort, TokensStorePort } from '../ports';

import { SignInCommand } from './sign-in.command';

@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
  public constructor(
    private readonly usersPort: UsersPort,
    private readonly tokensPort: TokensStorePort,
    private readonly jwtServicePort: JwtServicePort,
  ) {}

  public async execute({
    email,
    password,
  }: SignInCommand): Promise<AuthTokenPair> {
    const users = await this.usersPort.find({ email });

    if (users.length !== 1)
      throw new UnauthorizedException('Credentials are invalid');

    const user = users[0];

    if (!user || !(await compare(password, user.password)))
      throw new UnauthorizedException('Credentials are invalid');

    const payload = {
      sub: user.id,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        secondName: user.secondName,
        patronymic: user.patronymic,
        role: user.role,
      },
    };

    const { accessToken, refreshToken } =
      await this.jwtServicePort.createTokenPair(payload, '7d');

    await this.tokensPort.save(user.id, refreshToken, '7d');

    return {
      accessToken,
      refreshToken,
    };
  }
}
