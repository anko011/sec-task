import type { z } from 'zod';
import type { GetOrganizationContract } from '../api/contracts';

export type Organization = z.infer<typeof GetOrganizationContract>;
