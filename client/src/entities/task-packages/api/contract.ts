import { array, enums, number, object, optional, string } from 'superstruct';

import { TaskPackageStatus } from '../model/task-package';

export const GetTaskPackageContract = object({
    id: string(),
    name: string(),
    additionalInformation: optional(string()),
    baseDocument: object({
        name: string(),
        url: string()
    }),
    incomingRequisite: string(),
    outgoingRequisite: string(),
    status: enums([TaskPackageStatus.FIXED, TaskPackageStatus.ACTIVE]),
    tasksNumber: number()
});

export const GetAllTaskPackagesContract = array(GetTaskPackageContract);
