import { array, boolean, define, enums, number, object, optional, string } from 'superstruct';

import { paginated } from '~/shared/api';

import { TaskPackageStatus } from '../model/task-package';

const DateOrString = define<Date>('DateOrString', (value) => {
    if (value instanceof Date) return true; // Уже Date
    if (typeof value === 'string') {
        const date = new Date(value);
        return !isNaN(date.getTime()); // Проверяем, что строка — валидная дата
    }
    return false;
});

export const GetTaskPackageContract = object({
    id: string(),
    additionalInformation: optional(string()),
    assignedOrganizationCount: number(),
    assignedOrganizationIds: array(string()),
    createdAt: DateOrString,
    incomingRequisite: string(),
    outgoingRequisite: string(),
    reportDeadline: object({
        deadline: DateOrString,
        needsPostpone: boolean()
    }),
    status: enums([TaskPackageStatus.FIXED, TaskPackageStatus.ACTIVE]),
    submissionData: DateOrString,
    taskExecutions: array(),
    tasks: array(),
    tasksCount: number()
});

export const GetPaginatedTaskPackagesContract = paginated(GetTaskPackageContract);
