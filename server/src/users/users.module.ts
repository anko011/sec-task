import { Module } from '@nestjs/common';

import { UsersFactory } from './application/factories';
import { handlers as usersQueryHandlers } from './application/queries/users';
import { handlers as usersCommandsHandlers } from './application/commands/users';

import {
  UsersController,
  UsersWithOrganizationController,
} from './presentation/controllers';
import { UsersPort } from './application/ports';
import { UsersInMemoryAdapter } from './infrastructure/adapters';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [OrganizationsModule],
  providers: [
    ...usersQueryHandlers,
    ...usersCommandsHandlers,
    { provide: UsersPort, useClass: UsersInMemoryAdapter },
    UsersFactory,
  ],
  controllers: [UsersController, UsersWithOrganizationController],
  exports: [UsersFactory, UsersPort],
})
export class UsersModule {}
