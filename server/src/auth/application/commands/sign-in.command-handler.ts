import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { compare } from 'bcrypt';

import { UsersStorePort } from '../../../users/application/ports';

import { AuthTokenPair } from '../entities';
import { JwtServicePort, TokensStorePort } from '../ports';

import { SignInCommand } from './sign-in.command';

@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
  public constructor(
    private readonly usersStorePort: UsersStorePort,
    private readonly tokensPort: TokensStorePort,
    private readonly jwtServicePort: JwtServicePort,
  ) {}

  public async execute({
    email,
    password,
  }: SignInCommand): Promise<AuthTokenPair> {
    const user = await this.usersStorePort.findOne({ email });

    if (!user || !(await compare(password, user.password)))
      throw new UnauthorizedException('Credentials are invalid');

    const payload = { sub: user.id, role: user.role };

    const { accessToken, refreshToken } =
      await this.jwtServicePort.createTokenPair(payload, '7d');

    await this.tokensPort.save(user.id, refreshToken, '7d');

    return {
      accessToken,
      refreshToken,
    };
  }
}
