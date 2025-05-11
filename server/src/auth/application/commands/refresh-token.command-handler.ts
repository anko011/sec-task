import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtServicePort } from '../ports';
import { RefreshTokenCommand } from './refresh-token.command';
import { TokenExpiredError } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(private readonly jwtServicePort: JwtServicePort) {}

  async execute({ refreshToken }: RefreshTokenCommand) {
    try {
      const payload = await this.jwtServicePort.verify(refreshToken);
      return await this.jwtServicePort.createAccessToken({
        sub: payload.sub,
        role: payload.role,
      });
    } catch (e) {
      if (e instanceof TokenExpiredError)
        throw new UnauthorizedException('Token expired');

      if (e instanceof JsonWebTokenError)
        throw new BadRequestException(e.message);

      throw e;
    }
  }
}
