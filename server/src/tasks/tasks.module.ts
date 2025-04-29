import { Module } from '@nestjs/common';

import { TaskPackageFactory } from './application/factories';

import { handlers as taskPackagesCommandHandlers } from './application/commands/task-packages';
import { handlers as taskPackagesQueryHandlers } from './application/queries/task-packages';

import { handlers as tasksCommandHandlers } from './application/commands/tasks';
import { handlers as tasksQueryHandlers } from './application/queries/tasks';

import {
  InMemoryTaskCategoriesPersistenceModule,
  InMemoryTaskPackagesPersistenceModule,
} from './infrastructure/persistence';

import { TaskPackagesController } from './presentation/controllers';

const commandHandlers = [
  ...taskPackagesCommandHandlers,
  ...tasksCommandHandlers,
];

const queryHandlers = [...taskPackagesQueryHandlers, ...tasksQueryHandlers];

const factories = [TaskPackageFactory];

@Module({
  imports: [
    InMemoryTaskPackagesPersistenceModule,
    InMemoryTaskCategoriesPersistenceModule,
  ],
  providers: [...queryHandlers, ...commandHandlers, ...factories],
  controllers: [TaskPackagesController],
})
export class TasksModule {}
