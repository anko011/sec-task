import { array, boolean, date, enums, object, optional, string } from 'superstruct';

import { TaskStatus } from '~/entities/tasks';

export const GetOrganizationContract = object({
    id: string(),
    type: object({
        id: string(),
        name: string()
    }),
    name: string(),
    isArchived: boolean()
});
export const GetAllOrganizationsContract = array(GetOrganizationContract);

export const GetStatusChangeContract = object({
    id: string(),
    changedAt: date(),
    comment: string(),
    newStatus: enums(Object.values(TaskStatus)),
    oldStatus: optional(enums(Object.values(TaskStatus))),
    organization: GetOrganizationContract,
    packageId: string(),
    taskId: string()
});

export const GetAllStatusChangeContract = array(GetStatusChangeContract);
