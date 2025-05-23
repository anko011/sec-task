import { CreateTaskContract, EditTaskContract } from '~/entities/tasks';
import { z } from 'zod';
import { paginated } from '~/shared/api';

import { TaskPackageStatus } from '../model/task-package-status';

export const GetAttachmentContract = z.object({
    id: z.string(),
    createdAt: z.string().transform((t) => {
        return new Date(t);
    }),
    updatedAt: z.string().transform((t) => {
        return new Date(t);
    }),
    filename: z.string(),
    path: z.string(),
    mimetype: z.string(),
    taskPackage: z.string()
});

export const GetTaskPackageContract = z.object({
    id: z.string(),
    createdAt: z.string().transform((t) => {
        return new Date(t);
    }),
    updatedAt: z.string().transform((t) => {
        return new Date(t);
    }),
    attachments: z.array(GetAttachmentContract),
    completionPercentage: z.number(),
    incomingRequisite: z.string(),
    outgoingRequisite: z.string(),
    status: z.nativeEnum(TaskPackageStatus),
    tasks: z.array(z.string()),
    organizations: z.array(z.string()),
    tasksCount: z.number(),
    organizationsCount: z.number(),
    reportDeadline: z.string().transform((t) => {
        return new Date(t);
    }),
    nearestTaskDeadline: z.optional(z.string()).transform((v) => {
        return v ? new Date(v) : undefined;
    })
});

export const GetPaginatedTaskPackageContract = paginated(GetTaskPackageContract);

export const CreateTaskPackageContract = z.object({
    incomingRequisite: z.string().nonempty('Обязательное поле'),
    outgoingRequisite: z.string().nonempty('Обязательное поле'),
    assignedOrganizationIds: z.array(z.string()),
    tasks: z.array(CreateTaskContract)
});
export const EditTaskPackageContract = z.object({
    incomingRequisite: z.optional(z.string().nonempty()),
    outgoingRequisite: z.optional(z.string().nonempty()),
    assignedOrganizationIds: z.optional(z.array(z.string())),
    attachmentIds: z.array(z.string()),
    tasks: z.array(CreateTaskContract.or(EditTaskContract))
});
