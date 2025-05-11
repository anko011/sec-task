import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UsersPort } from '../../ports';
import { User } from '../../entities';

import { FindUserQuery } from './find-user.query';

@QueryHandler(FindUserQuery)
export class FindUserQueryHandler implements IQueryHandler<FindUserQuery> {
  public constructor(private readonly usersPort: UsersPort) {}

  public async execute({ id }: FindUserQuery): Promise<User> {
    const users = await this.usersPort.find({ id });

    if (users.length === 0)
      throw new NotFoundException(`User with id ${id} not found`);

    if (users.length !== 1)
      throw new InternalServerErrorException(
        `User with id ${id} has been matched with several entities`,
      );

    return users[0];
  }
}
