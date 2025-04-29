export abstract class TokensStorePort {
  abstract save(
    userId: string,
    refreshToken: string,
    ttl: string,
  ): Promise<void>;

  abstract remove(userId: string, refreshToken: string): Promise<void>;

  abstract isExists(userId: string, refreshToken: string): Promise<boolean>;
}
