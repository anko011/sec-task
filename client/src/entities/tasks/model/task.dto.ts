import type { Task } from './task';

export type TaskDTO = Omit<Task, 'id' | 'packageId' | 'assigneeProgresses'>;
