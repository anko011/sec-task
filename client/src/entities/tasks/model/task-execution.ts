import type { z } from 'zod';
import type { GetTaskExecutionContract } from '../api/contracts';

export type TaskExecution = z.infer<typeof GetTaskExecutionContract>;
