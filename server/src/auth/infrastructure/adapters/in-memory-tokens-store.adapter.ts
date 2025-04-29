import { Inject, Injectable } from '@nestjs/common';
import { TokensStorePort } from '../../application/ports';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class InMemoryTokensStoreAdapter implements TokensStorePort {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async save(userId: string, refreshToken: string, ttl: string): Promise<void> {
    await this.cacheManager.set(
      `${userId}:${refreshToken}`,
      'valid',
      this.parseTtl(ttl),
    );
  }

  async remove(userId: string, refreshToken: string): Promise<void> {
    if (await this.isExists(userId, refreshToken))
      await this.cacheManager.del(`${userId}:${refreshToken}`);
  }

  async isExists(userId: string, refreshToken: string): Promise<boolean> {
    return !!(await this.cacheManager.get(`${userId}:${refreshToken}`));
  }

  private parseTtl(ttl: string): number {
    const units = {
      s: 1,
      m: 60,
      h: 60 * 60,
      d: 24 * 60 * 60,
    };

    const match = ttl.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 0;
    }

    const value = parseInt(match[1]);
    const unit = match[2] as keyof typeof units;
    return value * units[unit];
  }
}
