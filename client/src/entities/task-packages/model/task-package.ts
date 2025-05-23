import type { z } from 'zod';
import type { GetTaskPackageContract } from '../api/contracts';

export type TaskPackage = z.infer<typeof GetTaskPackageContract>;
