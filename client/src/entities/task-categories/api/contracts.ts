import { object, string } from 'superstruct';

import { paginated } from '~/shared/api';

export const GetTaskCategoryContract = object({
    id: string(),
    name: string(),
    color: string()
});

export const GetPaginatedTaskCategoriesContract = paginated(GetTaskCategoryContract);
