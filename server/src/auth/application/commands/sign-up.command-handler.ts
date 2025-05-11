import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { genSalt, hash } from 'bcryptjs';

import { Role } from '../../../users/application/entities';
import { UsersPort } from '../../../users/application/ports';
import { UsersFactory } from '../../../users/application/factories';
import { JwtServicePort, TokensStorePort } from '../ports';

import { SignUpCommand } from './sign-up.command';
import { OrganizationsPort } from '../../../organizations/applications/ports';

@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  public constructor(
    private readonly usersPort: UsersPort,
    private readonly usersFactory: UsersFactory,
    private readonly jwtServicePort: JwtServicePort,
    private readonly tokensStorePort: TokensStorePort,
    private readonly organizationsPort: OrganizationsPort,
  ) {}

  async execute({ props: { password, ...props } }: SignUpCommand) {
    const isExistUser =
      (await this.usersPort.find({ email: props.email })).length !== 0;
    if (isExistUser) throw new BadRequestException('User already exists');

    const organizations = await this.organizationsPort.find({
      id: props.organizationId,
    });

    if (organizations.length !== 1)
      throw new BadRequestException(
        `Organization with ${props.organizationId} does not exist`,
      );

    const hashedPassword = await hash(password, await genSalt());
    const user = this.usersFactory.create({
      ...props,
      password: hashedPassword,
      role: Role.Assigner,
      organizationId: organizations[0].id,
    });

    await this.usersPort.save(user);

    const payload = { sub: user.id, role: user.role };

    const { accessToken, refreshToken } =
      await this.jwtServicePort.createTokenPair(payload, '7d');

    await this.tokensStorePort.save(user.id, refreshToken, '7d');

    return { accessToken };
  }
}
