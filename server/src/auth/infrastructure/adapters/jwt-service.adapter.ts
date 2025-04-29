import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../../users/application/entities';

import { AuthTokenPair } from '../../application/entities';
import { JwtServicePort } from '../../application/ports';

@Injectable()
export class JwtServiceAdapter implements JwtServicePort {
  constructor(private readonly jwtService: JwtService) {}

  async createTokenPair(
    payload: Buffer | object,
    ttl?: string,
  ): Promise<AuthTokenPair> {
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: ttl,
      }),
    };
  }

  async verify(refreshToken: string): Promise<{ sub: string; role: Role }> {
    return this.jwtService.verifyAsync(refreshToken);
  }

  async createAccessToken(payload: Buffer | object): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
