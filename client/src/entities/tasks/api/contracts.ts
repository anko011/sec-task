import { z } from 'zod';

import { GetTaskCategoryContract } from '~/entities/task-categories';
import { GetTaskNameContract } from '~/entities/task-names';
import { paginated } from '~/shared/api';

import { TaskDangerStatus } from '../model/task-danger-status';
import { TaskStatus } from '../model/task-status';
import { GetOrganizationContract } from '~/entities/organizations';

export const GetTaskStatusHistoryContract = z.object({
    id: z.string(),
    oldStatus: z.nativeEnum(TaskStatus).nullish(),
    newStatus: z.nativeEnum(TaskStatus),
    comment: z.string(),
    execution: z.string(),
    createdAt: z.string().transform((t) => {
        return new Date(t);
    }),
    updatedAt: z.string().transform((t) => {
        return new Date(t);
    })
});

export const GetTaskStatusHistoriesContract = z.array(GetTaskStatusHistoryContract);

export const GetTaskExecutionContract = z.object({
    id: z.string(),
    createdAt: z.string().transform((t) => {
        return new Date(t);
    }),
    updatedAt: z.string().transform((t) => {
        return new Date(t);
    }),
    lastStatus: z.nativeEnum(TaskStatus),
    organization: GetOrganizationContract,
    task: z.string(),
    taskPackage: z.string()
});

export const GetTaskExecutionsContract = z.array(GetTaskExecutionContract);

export const GetTaskContract = z.object({
    id: z.string(),
    createdAt: z.string().transform((t) => {
        return new Date(t);
    }),
    updatedAt: z.string().transform((t) => {
        return new Date(t);
    }),
    additionalInformation: z.optional(z.string().nullable()),
    number: z.string(),
    description: z.string(),
    bdu: z.array(z.string()),
    cve: z.array(z.string()),
    dangerStatus: z.nativeEnum(TaskDangerStatus),
    name: GetTaskNameContract,
    category: GetTaskCategoryContract,
    taskPackage: z.string(),
    deadline: z.string().transform((t) => {
        return new Date(t);
    }),
    progress: z.number()
});

export const GetPaginatedTasksContract = paginated(GetTaskContract);

export const CreateTaskContract = z.object({
    nameId: z.string({ message: 'Обязательное поле' }),
    categoryId: z.string({ message: 'Обязательное поле' }),
    number: z.string({ message: 'Обязательное поле' }),
    description: z.string({ message: 'Обязательное поле' }),
    dangerStatus: z.nativeEnum(TaskDangerStatus, { message: 'Обязательное поле' }),
    bdu: z.array(z.string()),
    cve: z.array(z.string()),
    additionalInformation: z.optional(z.string().nullable())
});

export const EditTaskContract = CreateTaskContract.partial();
