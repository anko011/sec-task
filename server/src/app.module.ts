import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AbilityModule } from './ability/ability.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CqrsModule.forRoot(),
    AuthModule,
    AbilityModule,
    TasksModule,
    UsersModule,
  ],
})
export class AppModule {}
