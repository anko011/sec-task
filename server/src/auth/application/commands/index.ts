import { SignInCommandHandler } from './sign-in.command-handler';
import { SignUpCommandHandler } from './sign-up.command-handler';
import { RefreshTokenCommandHandler } from './refresh-token.command-handler';
import { LogoutCommandHandler } from './logout.command-handler';

export { SignInCommand } from './sign-in.command';
export { SignUpCommand } from './sign-up.command';
export { RefreshTokenCommand } from './refresh-token.command';
export { LogoutCommand } from './logout.command';

export const handlers = [
  SignInCommandHandler,
  SignUpCommandHandler,
  RefreshTokenCommandHandler,
  LogoutCommandHandler,
];
