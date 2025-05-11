import type { Task } from '~/entities/tasks';

export enum TaskPackageStatus {
    ACTIVE = 'ACTIVE',
    FIXED = 'FIXED'
}

export type BaseDocument = {
    name: string;
    url: string;
};

export type TaskPackage = {
    id: string;
    assignedOrganizationCount: number;
    assignedOrganizationIds: string[];
    createdAt: Date;
    incomingRequisite: string;
    outgoingRequisite: string;
    reportDeadline: {
        deadline: Date;
        needsPostpone: boolean;
    };
    status: TaskPackageStatus;
    submissionData: Date;
    tasks: Task[];
    tasksCount: number;
};
