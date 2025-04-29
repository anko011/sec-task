import { Module } from '@nestjs/common';

import { UsersFactory } from './application/factories';
import { handlers as usersQueryHandlers } from './application/queries/users';

import { UsersPersistenceModule } from './infrastructure/persistence/users';

import { UsersController } from './presentation/controllers';

@Module({
  imports: [UsersPersistenceModule],
  providers: [UsersFactory, ...usersQueryHandlers],
  controllers: [UsersController],
  exports: [UsersPersistenceModule, UsersFactory],
})
export class UsersModule {}
