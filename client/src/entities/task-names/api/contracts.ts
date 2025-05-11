import { object, string } from 'superstruct';

import { paginated } from '~/shared/api';

export const GetTaskNameContract = object({
    id: string(),
    name: string()
});

export const GetPaginatedTaskNamesContract = paginated(GetTaskNameContract);
