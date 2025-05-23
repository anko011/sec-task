import type { z } from 'zod';

import type { GetUserContract, GetUserWithOrganizationContract } from '../api/contracts';

export enum Role {
    Admin = 'admin',
    Assigner = 'assigner',
    Operator = 'operator',
    Supervisor = 'supervisor'
}

export type User = z.infer<typeof GetUserContract>;

export type UserWithOrganization = z.infer<typeof GetUserWithOrganizationContract>;
