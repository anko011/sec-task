import { array, enums, number, object, optional, string } from 'superstruct';

import { GetTaskCategoryContract } from '~/entities/task-categories';
import { paginated } from '~/shared/api';

import { TaskDangerStatus, TaskStatus } from '../model/task';

export const GetTaskContract = object({
    id: string(),
    description: string(),
    name: object({
        id: string(),
        name: string()
    }),
    additionalInformation: optional(string()),
    BDU: array(string()),
    category: GetTaskCategoryContract,
    createdAt: string(),
    CVE: array(string()),
    dangerStatus: enums([
        TaskDangerStatus.CRITICAL,
        TaskDangerStatus.HIGH,
        TaskDangerStatus.MEDIUM,
        TaskDangerStatus.LOW
    ]),
    deadline: string(),
    number: string(),
    progress: object({
        completed: number(),
        percentage: number(),
        total: number()
    }),
    status: enums(Object.values(TaskStatus))
});

export const GetPaginatedTasksContract = paginated(GetTaskContract);

export const GetTasksContract = array(GetTaskContract);
