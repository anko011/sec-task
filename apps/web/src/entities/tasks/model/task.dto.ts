import type { Assignee } from '~/entities/assignees/@x/tasks';

import type { Task } from './task';

export type TaskDTO = Omit<Task, 'id' | 'packageId' | 'assigneeProgresses'> & {
    assignees: Assignee[];
};
