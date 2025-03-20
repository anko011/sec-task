import type { Assignee } from '~/entities/assignees/@x/tasks';
import type { TaskCategory } from '~/entities/task-categories/@x/tasks';

export enum TaskStatus {
    COMPENSATED = 'COMPENSATED',
    COMPLETED = 'COMPLETED',
    IN_PROGRESS = 'IN_PROGRESS',
    NEW = 'NEW',
    NO_ACTUAL = 'NO_ACTUAL'
}

export enum TaskDangerStatus {
    CRITICAL = 'CRITICAL',
    HIGH = 'HIGH',
    LOW = 'LOW',
    MEDIUM = 'MEDIUM'
}

export type TaskProgress = {
    assignee: Assignee;
    status: TaskStatus;
};

export type Task = {
    id: string;
    description: string;
    name: string;
    assigneeProgresses: TaskProgress[];
    category: TaskCategory;
    dangerStatus: TaskDangerStatus;
    packageId: string;
};
