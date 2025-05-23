import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { genSalt, hash } from 'bcryptjs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';

import { Role, User } from '../../entities';

import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({ dto }: CreateUserCommand): Promise<User> {
    const maybeUser = await this.usersRepository.findOne({ email: dto.email });

    if (maybeUser)
      throw new BadRequestException({
        email: `User with email ${dto.email} already exists`,
      });

    const hashedPassword = await hash(dto.password, await genSalt());
    const user = new User(
      dto.firstName,
      dto.secondName,
      dto.patronymic,
      dto.email,
      dto.role,
      hashedPassword,
      dto.role !== Role.Assigner ? null : dto.organizationId,
    );

    await this.entityManager.persistAndFlush(user);

    return user.populate(['organization.type.id'], { refresh: true });
  }
}
