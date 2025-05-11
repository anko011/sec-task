import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersPort } from '../../ports';
import { User } from '../../entities';
import { CreateUserCommand } from './create-user.command';
import { UsersFactory } from '../../factories';
import { OrganizationsPort } from '../../../../organizations/applications/ports';
import { genSalt, hash } from 'bcryptjs';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  public constructor(
    private readonly usersPort: UsersPort,
    private readonly usersFactory: UsersFactory,
    private readonly organizationsPort: OrganizationsPort,
  ) {}

  public async execute({ dto }: CreateUserCommand): Promise<User> {
    const users = await this.usersPort.find({ email: dto.email });

    if (users.length !== 0)
      throw new NotFoundException(
        `User with email ${dto.email} already exists`,
      );

    const organizations = await this.organizationsPort.find({
      id: dto.organizationId,
    });

    if (organizations.length !== 1)
      throw new BadRequestException('Organziation with id not found');

    const user = this.usersFactory.create({
      ...dto,
      password: await hash(dto.password, await genSalt()),
    });

    return await this.usersPort.save(user);
  }
}
