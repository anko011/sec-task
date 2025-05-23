import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AbilityModule } from './ability/ability.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import { Migrator } from '@mikro-orm/migrations';
import { IsExistingIdConstraint } from '~/common/validators';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '~/common/pipes';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SeedManager } from '@mikro-orm/seeder';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      dbName: 'test.db',
      driver: BetterSqliteDriver,
      debug: false,
      autoLoadEntities: true,
      allowGlobalContext: true,
      extensions: [Migrator, SeedManager],
      pool: {
        min: 1,
        max: 1,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot(),
    CqrsModule.forRoot(),
    AuthModule,
    AbilityModule,
    TasksModule,
    UsersModule,
    OrganizationsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    IsExistingIdConstraint,
  ],
})
export class AppModule {}
