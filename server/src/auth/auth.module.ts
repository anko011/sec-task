import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from '../users/users.module';

import { handlers as authHandlers } from './application/commands';
import { AuthController } from './presentation/controllers/';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './presentation/guards';
import { JwtServicePort, TokensStorePort } from './application/ports';
import {
  InMemoryTokensStoreAdapter,
  JwtServiceAdapter,
} from './infrastructure/adapters';
import { CacheModule } from '@nestjs/cache-manager';

//TODO: It needs to add a comparison between access and refresh token (by refresh token ID)

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('AUTH_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: TokensStorePort,
      useClass: InMemoryTokensStoreAdapter,
    },
    {
      provide: JwtServicePort,
      useClass: JwtServiceAdapter,
    },
    ...authHandlers,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
