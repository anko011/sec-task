import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersPort } from '../../ports';

import { DeleteUserCommand } from './delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
  implements ICommandHandler<DeleteUserCommand>
{
  public constructor(private readonly usersPort: UsersPort) {}

  public async execute({ id }: DeleteUserCommand): Promise<void> {
    const users = await this.usersPort.find({ id });

    if (users.length !== 1)
      throw new NotFoundException(`User with id ${id} not found`);

    await this.usersPort.delete(users[0]);
  }
}
