import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CsvModule } from 'nest-csv-parser';

import { Role, User } from './application/entities/user';

import { handlers as usersQueryHandlers } from './application/queries/users';
import { handlers as usersCommandsHandlers } from './application/commands/users';

import {
  UsersController,
  UsersWithOrganizationController,
} from './presentation/controllers';
import {
  Organization,
  OrganizationType,
} from '~/organizations/applications/entities';
import { EntityManager } from '@mikro-orm/better-sqlite';
import { genSalt, hash } from 'bcryptjs';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CsvModule,
    ConfigModule,
    MikroOrmModule.forFeature([User, Organization, OrganizationType]),
  ],
  providers: [...usersQueryHandlers, ...usersCommandsHandlers],
  controllers: [UsersController, UsersWithOrganizationController],
})
export class UsersModule {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const email = this.configService.get('ADMIN_EMAIL') as string;

    if (await this.entityManager.findOne(User, { email })) return;

    const firstName = this.configService.get('ADMIN_FIRST_NAME') as string;
    const secondName = this.configService.get('ADMIN_SECOND_NAME') as string;
    const patronymic = this.configService.get('ADMIN_PATRONYMIC') as string;
    const password = this.configService.get('ADMIN_PASSWORD') as string;

    const user = new User(
      firstName,
      secondName,
      patronymic,
      email,
      Role.Admin,
      await hash(password, await genSalt()),
      null,
    );

    await this.entityManager.persistAndFlush(user);
  }
}
