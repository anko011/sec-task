import { Module } from '@nestjs/common';
import { TaskCategoriesPort } from '../../../../application/ports';
import { InMemoryTaskCategoriesRepository } from './in-memory-task-categories.repository';

@Module({
  providers: [
    {
      provide: TaskCategoriesPort,
      useClass: InMemoryTaskCategoriesRepository,
    },
  ],
  exports: [TaskCategoriesPort],
})
export class InMemoryTaskCategoriesPersistenceModule {}
