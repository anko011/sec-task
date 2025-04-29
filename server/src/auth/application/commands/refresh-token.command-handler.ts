import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';

import { UsersStorePort } from '../../../users/application/ports';

import { JwtServicePort, TokensStorePort } from '../ports';

import { RefreshTokenCommand } from './refresh-token.command';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private readonly tokensStorePort: TokensStorePort,
    private readonly jwtServicePort: JwtServicePort,
    private readonly usersStorePort: UsersStorePort,
  ) {}

  async execute({ refreshToken: oldRefreshToken }: RefreshTokenCommand) {
    const { sub: userId } = await this.jwtServicePort.verify(oldRefreshToken);

    const user = await this.usersStorePort.findOne({ id: userId });
    if (!user) throw new UnauthorizedException('Invalid refresh token');

    const isExists = await this.tokensStorePort.isExists(
      user.id,
      oldRefreshToken,
    );

    if (!isExists) throw new UnauthorizedException('Invalid refresh token');

    const payload = { sub: user.id, role: user.role };
    const { accessToken, refreshToken } =
      await this.jwtServicePort.createTokenPair(payload, '7d');

    await this.tokensStorePort.remove(userId, oldRefreshToken);
    await this.tokensStorePort.save(userId, refreshToken, '7d');

    return { accessToken, refreshToken };
  }
}
