import { AuthTokenPair } from '../entities';
import { Role } from '../../../users/application/entities';

export abstract class JwtServicePort {
  abstract createTokenPair(
    payload: Buffer | object,
    ttl?: string,
  ): Promise<AuthTokenPair>;

  abstract verify(refreshToken: string): Promise<{ sub: string; role: Role }>;

  abstract decode(refreshToken: string): Promise<{ sub: string; role: Role }>;

  abstract createAccessToken(payload: Buffer | object): Promise<string>;
}
