import type { z } from 'zod';

import type { GetTaskCategoryContract } from '../api/contracts';

export type TaskCategory = z.infer<typeof GetTaskCategoryContract>;
