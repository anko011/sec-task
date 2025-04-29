import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AbilityFactory } from './application/factories';
import { PoliciesGuard } from './presentation/guards';

@Module({
  providers: [AbilityFactory, { provide: APP_GUARD, useClass: PoliciesGuard }],
})
export class AbilityModule {}
