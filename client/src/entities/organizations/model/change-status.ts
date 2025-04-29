import type { Organization } from '~/entities/organizations';
import type { TaskStatus } from '~/entities/tasks';

export type StatusChange = {
    id: string;
    changedAt: Date;
    comment: string;
    newStatus: TaskStatus;
    oldStatus?: TaskStatus;
    organization: Organization;
    packageId: string;
    taskId: string;
};
