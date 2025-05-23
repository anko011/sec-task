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
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '~/users/application/entities';
import { EntityRepository } from '@mikro-orm/better-sqlite';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
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
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) throw new UnauthorizedException(`Invalid data`);

    request['user'] = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
