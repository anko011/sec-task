import { Module } from '@nestjs/common';
import { InMemoryUsersAdapter } from './in-memory.adapter';
import { UsersStorePort } from '../../../application/ports';

@Module({
  providers: [
    {
      useClass: InMemoryUsersAdapter,
      provide: UsersStorePort,
    },
  ],
  exports: [UsersStorePort],
})
export class UsersPersistenceModule {}
