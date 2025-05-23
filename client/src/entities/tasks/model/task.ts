import type { z } from 'zod';

import type { GetTaskContract } from '../api/contracts';

export type Task = z.infer<typeof GetTaskContract>;
