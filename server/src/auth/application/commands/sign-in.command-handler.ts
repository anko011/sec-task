import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { compare } from 'bcryptjs';

import { AuthTokenPair } from '../entities';
import { JwtServicePort, TokensStorePort } from '../ports';

import { SignInCommand } from './sign-in.command';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';
import { User } from '~/users/application/entities';

@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    private readonly tokensPort: TokensStorePort,
    private readonly jwtServicePort: JwtServicePort,
  ) {}

  public async execute({
    email,
    password,
  }: SignInCommand): Promise<AuthTokenPair> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) throw new UnauthorizedException('Credentials are invalid');

    if (!(await compare(password, user.password)))
      throw new UnauthorizedException('Credentials are invalid pass');

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
