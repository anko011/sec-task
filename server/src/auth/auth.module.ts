import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from '../users/users.module';

import { handlers as authCommandHandlers } from './application/commands';
import { handlers as authQueryHandlers } from './application/queries/users';

import { AuthController } from './presentation/controllers/';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './presentation/guards';
import { JwtServicePort, TokensStorePort } from './application/ports';
import {
  InMemoryTokensStoreAdapter,
  JwtServiceAdapter,
} from './infrastructure/adapters';
import { CacheModule } from '@nestjs/cache-manager';
import { OrganizationsModule } from '../organizations/organizations.module';
import { MutexStoreService } from './infrastructure/adapters/mutext-store.adapter';

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule,
    OrganizationsModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('AUTH_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [
    MutexStoreService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: TokensStorePort, useClass: InMemoryTokensStoreAdapter },
    { provide: JwtServicePort, useClass: JwtServiceAdapter },
    ...authCommandHandlers,
    ...authQueryHandlers,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
