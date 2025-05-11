import { object, string } from 'superstruct';

import { paginated } from '~/shared/api';

export const GetOrganizationTypeContract = object({
    id: string(),
    name: string()
});

export const GetPaginatedOrganizationTypesContract = paginated(GetOrganizationTypeContract);
