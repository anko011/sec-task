import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { handlers as organizationsQueryHandlers } from './applications/queries/organizations';
import { handlers as organizationsCommandsHandlers } from './applications/commands/organizations';
import { handlers as organizationTypeQueryHandlers } from './applications/queries/organization-types';
import { handlers as organizationTypeCommandsHandlers } from './applications/commands/organization-types';

import { Organization, OrganizationType } from './applications/entities';
import {
  OrganizationsController,
  OrganizationTypesController,
} from '~/organizations/presentation/controllers';

@Module({
  imports: [MikroOrmModule.forFeature([Organization, OrganizationType])],
  providers: [
    ...organizationsQueryHandlers,
    ...organizationsCommandsHandlers,
    ...organizationTypeQueryHandlers,
    ...organizationTypeCommandsHandlers,
  ],
  controllers: [OrganizationsController, OrganizationTypesController],
})
export class OrganizationsModule {}
