import { boolean, object, string } from 'superstruct';

import { paginated } from '~/shared/api';

export const GetOrganizationContract = object({
    id: string(),
    type: object({
        id: string(),
        name: string()
    }),
    name: string(),
    isArchived: boolean()
});

export const GetPaginatedOrganizationsContract = paginated(GetOrganizationContract);
