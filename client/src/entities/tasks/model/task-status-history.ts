import type { z } from 'zod';
import type { GetTaskStatusHistoryContract } from '../api/contracts';

export type TaskStatusHistory = z.infer<typeof GetTaskStatusHistoryContract>;
