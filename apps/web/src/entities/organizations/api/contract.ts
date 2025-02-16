import { array, boolean, object, string } from 'superstruct';

export const GetAllOrganizationsContract = array(
    object({
        id: string(),
        type: object({
            id: string(),
            name: string()
        }),
        name: string(),
        isArchived: boolean()
    })
);
