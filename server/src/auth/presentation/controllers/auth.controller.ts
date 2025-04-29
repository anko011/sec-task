import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDTO, SignUpDTO } from '../contracts';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { SignInCommand, SignUpCommand } from '../../application/commands';
import { AuthTokenPair } from '../../application/entities';
import { Public, RefreshToken } from '../decorators';
import { RefreshTokenCommand } from '../../application/commands/refresh-token.command';

//TODO: It needs to be refactored

@Controller('auth')
export class AuthController {
  public constructor(private readonly commandBus: CommandBus) {}

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
    @RefreshToken() oldRefreshToken: string | null,
  ): Promise<{ accessToken: string }> {
    if (!oldRefreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    const { accessToken, refreshToken }: AuthTokenPair =
      await this.commandBus.execute(new RefreshTokenCommand(oldRefreshToken));

    res.cookie('refreshToken', refreshToken, { maxAge: 604_800_000 });
    return { accessToken };
  }
}
