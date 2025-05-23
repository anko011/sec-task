import type { useTaskPackage } from './use-task-package';

export type TaskPackageWithTasks = NonNullable<ReturnType<typeof useTaskPackage>['data']>;
