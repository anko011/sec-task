import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '~/users/application/entities';

import { handlers as usersQueryHandlers } from './application/queries/users';
import { handlers as usersCommandsHandlers } from './application/commands/users';

import {
  UsersController,
  UsersWithOrganizationController,
} from './presentation/controllers';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [OrganizationsModule, MikroOrmModule.forFeature([User])],
  providers: [...usersQueryHandlers, ...usersCommandsHandlers],
  controllers: [UsersController, UsersWithOrganizationController],
})
export class UsersModule {}
