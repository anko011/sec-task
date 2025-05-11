import type { Organization } from '~/entities/organizations';
import type { TaskCategory } from '~/entities/task-categories';
import type { TaskName } from '~/entities/task-names';

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
    organization: Organization;
    status: TaskStatus;
};

export type Task = {
    id: string;
    description: string;
    name: TaskName;
    additionalInformation?: string;
    BDU?: string[];
    category: TaskCategory;
    createdAt: Date;
    CVE?: string[];
    dangerStatus: TaskDangerStatus;
    deadline: Date;
    number: string;
    progress: {
        completed: number;
        percentage: number;
        total: number;
    };
    status: TaskStatus;
};
