import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCurrentUserQuery } from './get-current-user.query';
import { JwtServicePort } from '../../ports';
import { User } from '../../../../users/application/entities';
import { UnauthorizedException } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/better-sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserQueryHandler
  implements IQueryHandler<GetCurrentUserQuery>
{
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    private readonly jwtServicePort: JwtServicePort,
  ) {}

  async execute({ refreshToken }: GetCurrentUserQuery): Promise<User> {
    const payload = await this.jwtServicePort.decode(refreshToken);
    const user = await this.usersRepository.findOne({ id: payload.sub });
    if (!user) throw new UnauthorizedException('Invalid token');
    return user;
  }
}
