import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteUserCommand } from './delete-user.command';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../entities/user';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
  implements ICommandHandler<DeleteUserCommand>
{
  public constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({ id }: DeleteUserCommand): Promise<void> {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new NotFoundException(`User with id ${id}`);
    await this.entityManager.removeAndFlush(user);
  }
}
