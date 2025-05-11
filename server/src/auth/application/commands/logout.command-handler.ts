import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { JwtServicePort, TokensStorePort } from '../ports';

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    private readonly tokensStorePort: TokensStorePort,
    private readonly jwtService: JwtServicePort,
  ) {}

  async execute({ refreshToken }: LogoutCommand): Promise<void> {
    const { sub } = await this.jwtService.verify(refreshToken);
    await this.tokensStorePort.remove(sub, refreshToken);
  }
}
