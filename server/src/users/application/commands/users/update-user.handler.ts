import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersPort } from '../../ports';
import { User } from '../../entities';

import { UpdateUserCommand } from './update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  public constructor(private readonly usersPort: UsersPort) {}

  public async execute({ dto }: UpdateUserCommand): Promise<User> {
    const users = await this.usersPort.find({ id: dto.id });

    if (users.length !== 1)
      throw new NotFoundException(`User with id ${dto.id} not found`);

    const user = users[0];

    const updatedUser = Object.assign(user, {
      firstName: dto.firstName ?? user.firstName,
      secondName: dto.secondName ?? user.secondName,
      patronymic: dto.patronymic ?? user.patronymic,
      email: dto.email ?? user.email,
      role: dto.role ?? user.role,
    });

    return await this.usersPort.save(updatedUser);
  }
}
