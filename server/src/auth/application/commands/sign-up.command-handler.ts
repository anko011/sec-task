import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { genSalt, hash } from 'bcryptjs';

import { Role, User } from '../../../users/application/entities';
import { JwtServicePort, TokensStorePort } from '../ports';

import { SignUpCommand } from './sign-up.command';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';

@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    private readonly entityManager: EntityManager,
    private readonly jwtServicePort: JwtServicePort,
    private readonly tokensStorePort: TokensStorePort,
  ) {}

  async execute({ props: { password, ...props } }: SignUpCommand) {
    const isExistUser =
      (await this.usersRepository.count({ email: props.email })) !== 0;
    if (isExistUser) throw new BadRequestException('User already exists');

    const hashedPassword = await hash(password, await genSalt());
    const user = new User(
      props.firstName,
      props.secondName,
      props.patronymic,
      props.email,
      props.role ?? Role.Assigner,
      hashedPassword,
      props.organizationId,
    );

    await this.entityManager.persistAndFlush(user);

    const payload = { sub: user.id, role: user.role };

    const { accessToken, refreshToken } =
      await this.jwtServicePort.createTokenPair(payload, '7d');

    await this.tokensStorePort.save(user.id, refreshToken, '7d');

    return { accessToken };
  }
}
