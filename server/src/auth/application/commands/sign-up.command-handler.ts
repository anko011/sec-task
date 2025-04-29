import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { genSalt, hash } from 'bcrypt';

import { Role } from '../../../users/application/entities';
import { UsersStorePort } from '../../../users/application/ports';
import { UsersFactory } from '../../../users/application/factories';

import { AuthTokenPair } from '../entities';
import { JwtServicePort, TokensStorePort } from '../ports';

import { SignUpCommand } from './sign-up.command';

@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  public constructor(
    private readonly usersPort: UsersStorePort,
    private readonly usersFactory: UsersFactory,
    private readonly jwtServicePort: JwtServicePort,
    private readonly tokensStorePort: TokensStorePort,
  ) {}

  async execute({
    props: { password, ...props },
  }: SignUpCommand): Promise<AuthTokenPair> {
    const isExistUser =
      (await this.usersPort.find({ email: props.email })).length !== 0;
    if (isExistUser) throw new BadRequestException('User already exists');

    const hashedPassword = await hash(password, await genSalt());
    const user = this.usersFactory.create({
      ...props,
      password: hashedPassword,
      role: Role.Assigner,
    });

    await this.usersPort.save(user);

    const payload = { sub: user.id, role: user.role };

    const { accessToken, refreshToken } =
      await this.jwtServicePort.createTokenPair(payload, '7d');

    this.tokensStorePort.save(user.id, refreshToken, '7d');

    return { accessToken, refreshToken };
  }
}
