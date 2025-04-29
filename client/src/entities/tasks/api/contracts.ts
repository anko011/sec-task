import { array, boolean, enums, object, optional, string } from 'superstruct';

import { GetTaskCategoryContract } from '~/entities/task-categories/@x/tasks';

import { TaskDangerStatus, TaskStatus } from '../model/task';

export const GetTaskContract = object({
    id: string(),
    description: string(),
    name: string(),
    additionalInformation: optional(string()),
    assigneeProgresses: array(
        object({
            organization: object({
                id: string(),
                type: object({
                    id: string(),
                    name: string()
                }),
                name: string(),
                isArchived: boolean()
            }),
            status: enums([
                TaskStatus.NEW,
                TaskStatus.IN_PROGRESS,
                TaskStatus.COMPLETED,
                TaskStatus.COMPENSATED,
                TaskStatus.NO_ACTUAL
            ])
        })
    ),
    BDU: array(string()),
    category: GetTaskCategoryContract,
    CVE: array(string()),
    dangerStatus: enums([
        TaskDangerStatus.CRITICAL,
        TaskDangerStatus.HIGH,
        TaskDangerStatus.MEDIUM,
        TaskDangerStatus.LOW
    ]),
    number: string(),
    packageId: string()
});

export const GetTasksContract = array(GetTaskContract);
