import type { z } from 'zod';
import type { GetTaskNameContract } from '../api/contracts';

export type TaskName = z.infer<typeof GetTaskNameContract>;
