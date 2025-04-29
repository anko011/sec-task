import { Module } from '@nestjs/common';
import { TaskPackagesPort } from '../../../../application/ports';
import { InMemoryTaskPackagesRepository } from './in-memory-task-packages.repository';

@Module({
  providers: [
    {
      provide: TaskPackagesPort,
      useClass: InMemoryTaskPackagesRepository,
    },
  ],
  exports: [TaskPackagesPort],
})
export class InMemoryTaskPackagesPersistenceModule {}
