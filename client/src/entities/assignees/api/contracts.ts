import { array, boolean, object, string } from 'superstruct';

export const GetAssignee = object({
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
});

export const GetAllAssignees = array(GetAssignee);
