import { array, boolean, enums, object, string } from 'superstruct';

import { GetTaskCategoryContract } from '~/entities/task-categories/@x/tasks';

import { TaskDangerStatus, TaskStatus } from '../model/task';

export const GetTaskContract = object({
    id: string(),
    description: string(),
    name: string(),
    assigneeProgresses: array(
        object({
            assignee: object({
                id: string(),
                firstName: string(),
                organization: object({
                    id: string(),
                    type: object({
                        id: string(),
                        name: string()
                    }),
                    name: string(),
                    isArchived: boolean()
                }),
                secondName: string()
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
    category: GetTaskCategoryContract,
    dangerStatus: enums([
        TaskDangerStatus.CRITICAL,
        TaskDangerStatus.HIGH,
        TaskDangerStatus.MEDIUM,
        TaskDangerStatus.LOW
    ]),
    packageId: string()
});

export const GetTasksContract = array(GetTaskContract);
