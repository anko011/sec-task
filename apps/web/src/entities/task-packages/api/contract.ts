import { array, enums, number, object, string } from 'superstruct';

import { TaskPackageStatus } from '../model/task-package';

export const GetTaskPackageContract = object({
    id: string(),
    name: string(),
    baseDocument: object({
        name: string(),
        url: string()
    }),
    status: enums([TaskPackageStatus.FIXED, TaskPackageStatus.ACTIVE]),
    tasksNumber: number()
});

export const GetAllTaskPackagesContract = array(GetTaskPackageContract);
