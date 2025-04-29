import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokensFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async create(payload: Buffer | object, ttl?: string): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('AUTH_SECRET'),
      expiresIn: ttl,
    });
  }
}
