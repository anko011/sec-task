import { InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';
import { User } from '../../entities';

import { FindUserQuery } from './find-user.query';

@QueryHandler(FindUserQuery)
export class FindUserQueryHandler implements IQueryHandler<FindUserQuery> {
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
  ) {}

  public async execute({ id }: FindUserQuery): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user)
      throw new InternalServerErrorException(
        `User with id ${id} has been matched with several entities`,
      );

    return user;
  }
}
