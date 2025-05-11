import { Module } from '@nestjs/common';

import {
  TaskCategoryFactory,
  TaskNameFactory,
  TaskPackageFactory,
} from './application/factories';

import { handlers as taskPackagesCommandHandlers } from './application/commands/task-packages';
import { handlers as taskPackagesQueryHandlers } from './application/queries/task-packages';

import { handlers as tasksQueryHandlers } from './application/queries/tasks';
import { handlers as tasksCommandsHandlers } from './application/commands/tasks';

import { handlers as taskCategoriesQueryHandlers } from './application/queries/task-categories';
import { handlers as taskCategoriesCommandHandlers } from './application/commands/task-categories';

import { handlers as taskNamesQueryHandlers } from './application/queries/task-names';
import { handlers as taskNamesCommandHandlers } from './application/commands/task-name';

import {
  TaskCategoriesController,
  TaskNamesController,
  TaskPackagesController,
  TasksController,
} from './presentation/controllers';
import {
  TaskCategoriesPort,
  TaskNamesPort,
  TaskPackagesPort,
} from './application/ports';
import {
  TaskCategoryInMemoryAdapter,
  TaskNameInMemoryAdapter,
  TaskPackageInMemoryAdapter,
} from './infrastructure/adapters';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [OrganizationsModule],
  providers: [
    ...taskPackagesQueryHandlers,
    ...taskPackagesCommandHandlers,
    ...tasksQueryHandlers,
    ...tasksCommandsHandlers,
    ...taskCategoriesQueryHandlers,
    ...taskCategoriesCommandHandlers,
    ...taskNamesQueryHandlers,
    ...taskNamesCommandHandlers,
    TaskPackageFactory,
    TaskCategoryFactory,
    TaskNameFactory,
    { provide: TaskPackagesPort, useClass: TaskPackageInMemoryAdapter },
    { provide: TaskCategoriesPort, useClass: TaskCategoryInMemoryAdapter },
    { provide: TaskNamesPort, useClass: TaskNameInMemoryAdapter },
  ],
  controllers: [
    TaskPackagesController,
    TasksController,
    TaskCategoriesController,
    TaskNamesController,
  ],
})
export class TasksModule {}
