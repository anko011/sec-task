import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDTO, SignUpDTO } from '../contracts';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import {
  LogoutCommand,
  SignInCommand,
  SignUpCommand,
} from '../../application/commands';
import { AuthTokenPair } from '../../application/entities';
import { Public, RefreshToken } from '../decorators';
import { RefreshTokenCommand } from '../../application/commands/refresh-token.command';
import { GetCurrentUserQuery } from '../../application/queries/users';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({ summary: 'Users sign in' })
  @ApiBody({ type: SignInDTO })
  @ApiResponse({ status: HttpStatus.OK, type: AuthTokenPair })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('sign-in')
  public async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: SignInDTO,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken }: AuthTokenPair =
      await this.commandBus.execute(new SignInCommand(dto.email, dto.password));
    res.cookie('refreshToken', refreshToken, { maxAge: 604_800_000 });
    return { accessToken };
  }

  @ApiOperation({ summary: 'Users sign up' })
  @ApiBody({ type: SignUpDTO })
  @ApiResponse({ status: HttpStatus.OK, type: AuthTokenPair })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('sign-up')
  public async signUp(@Body() dto: SignUpDTO): Promise<AuthTokenPair> {
    return this.commandBus.execute(new SignUpCommand(dto));
  }

  @ApiOperation({ summary: 'Refresh tokens pair' })
  @Public()
  @Post('refresh')
  public async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @RefreshToken() refreshToken: string | null,
  ): Promise<{ accessToken: string }> {
    if (!refreshToken) throw new UnauthorizedException('Invalid refresh token');

    const accessToken = await this.commandBus.execute(
      new RefreshTokenCommand(refreshToken),
    );

    return { accessToken };
  }

  @ApiOperation({ summary: 'Logout' })
  @Public()
  @Post('logout')
  public async logout(
    @Res({ passthrough: true }) res: Response,
    @RefreshToken() oldRefreshToken: string | null,
  ) {
    if (!oldRefreshToken) throw new UnauthorizedException('No token provided');

    await this.commandBus.execute(new LogoutCommand(oldRefreshToken));

    res.cookie('refreshToken', '', { maxAge: 1 });
  }

  @Get('/me')
  async getMe(@RefreshToken() refreshToken: string | null) {
    if (!refreshToken) throw new UnauthorizedException('No token provided');
    return await this.queryBus.execute(new GetCurrentUserQuery(refreshToken));
  }
}
