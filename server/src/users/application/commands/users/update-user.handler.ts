import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';
import { genSalt, hash } from 'bcryptjs';

import { Role, User } from '../../entities';

import { UpdateUserCommand } from './update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({ id, dto }: UpdateUserCommand): Promise<User> {
    const user = await this.usersRepository.findOne(id, {
      populate: ['email', 'organization.type.id'],
    });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    if (dto.email) {
      const mayBeUser = await this.usersRepository.findOne({
        email: dto.email,
      });

      if (mayBeUser && dto.email !== user.email)
        throw new BadRequestException({
          email: `User with email ${dto.email} is exists`,
        });
    }

    const updatedUser = Object.assign(user, {
      firstName: dto.firstName ?? user.firstName,
      secondName: dto.secondName ?? user.secondName,
      patronymic: dto.patronymic ?? user.patronymic,
      email: dto.email ?? user.email,
      role: dto.role ?? user.role,
      organization: dto.role !== Role.Assigner ? null : dto.organizationId,
      password: dto.password
        ? await hash(dto.password, await genSalt())
        : user.password,
    });

    await this.entityManager.persistAndFlush(updatedUser);
    return user;
  }
}
