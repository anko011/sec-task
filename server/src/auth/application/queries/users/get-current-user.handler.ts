import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCurrentUserQuery } from './get-current-user.query';
import { UsersPort } from '../../../../users/application/ports';
import { JwtServicePort } from '../../ports';
import { User } from '../../../../users/application/entities';
import { UnauthorizedException } from '@nestjs/common';

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserQueryHandler
  implements IQueryHandler<GetCurrentUserQuery>
{
  constructor(
    private readonly usersPort: UsersPort,
    private readonly jwtServicePort: JwtServicePort,
  ) {}

  async execute({ refreshToken }: GetCurrentUserQuery): Promise<User> {
    const payload = await this.jwtServicePort.decode(refreshToken);
    const users = await this.usersPort.find({ id: payload.sub });
    if (users.length !== 1) throw new UnauthorizedException('Invalid token');
    return users[0];
  }
}
