import { Module } from '@nestjs/common';

import { handlers as organizationsQueryHandlers } from './applications/queries/organizations';
import { handlers as organizationsCommandsHandlers } from './applications/commands/organizations';
import { handlers as organizationTypeQueryHandlers } from './applications/queries/organization-types';
import { handlers as organizationTypeCommandsHandlers } from './applications/commands/organization-types';

import { OrganizationsPort, OrganizationTypesPort } from './applications/ports';
import {
  OrganizationsFactory,
  OrganizationTypesFactory,
} from './applications/factories';

import {
  OrganizationsInMemoryAdapter,
  OrganizationTypesInMemoryAdapter,
} from './infrastructure/adapters';

import {
  OrganizationsController,
  OrganizationTypesController,
} from './presentation/controllers';

@Module({
  providers: [
    ...organizationsQueryHandlers,
    ...organizationsCommandsHandlers,
    ...organizationTypeQueryHandlers,
    ...organizationTypeCommandsHandlers,
    OrganizationsFactory,
    OrganizationTypesFactory,
    {
      provide: OrganizationTypesPort,
      useClass: OrganizationTypesInMemoryAdapter,
    },
    {
      provide: OrganizationsPort,
      useClass: OrganizationsInMemoryAdapter,
    },
  ],
  controllers: [OrganizationsController, OrganizationTypesController],
  exports: [OrganizationsPort],
})
export class OrganizationsModule {}
