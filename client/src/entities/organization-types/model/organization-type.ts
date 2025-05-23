import type { z } from 'zod';
import type { GetOrganizationTypeContract } from '../api/contracts';

export type OrganizationType = z.infer<typeof GetOrganizationTypeContract>;
