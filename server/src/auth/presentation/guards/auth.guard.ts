import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { IS_PUBLIC_KEY } from '../decorators';
import { ConfigService } from '@nestjs/config';
import { UsersPort } from '../../../users/application/ports';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly usersPort: UsersPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);

    if (!accessToken) throw new UnauthorizedException('Authorization failed');

    let userId: string | undefined = undefined;
    try {
      const token = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('AUTH_SECRET'),
      });

      userId = token.sub;
    } catch (err) {
      if (err instanceof TokenExpiredError)
        throw new UnauthorizedException('Token expired');

      throw err;
    }
    const users = await this.usersPort.find({ id: userId });
    if (users.length !== 1) throw new UnauthorizedException(`Invalid data`);

    request['user'] = users[0];

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
