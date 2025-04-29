import type { Organization } from '~/entities/organizations';
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
    organization: Organization;
    status: TaskStatus;
};

export type Task = {
    id: string;
    description: string;
    name: string;
    additionalInformation?: string;
    assigneeProgresses: TaskProgress[];
    BDU?: string[];
    category: TaskCategory;
    CVE?: string[];
    dangerStatus: TaskDangerStatus;
    number: string;
    packageId: string;
};
