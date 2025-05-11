import { enums, object, string } from 'superstruct';

import { GetOrganizationContract } from '~/entities/organizations/api/contract';
import { paginated } from '~/shared/api';

import { Role } from '../model';

export const GetUserContract = object({
    id: string(),
    email: string(),
    firstName: string(),
    organizationId: string(),
    patronymic: string(),
    role: enums(Object.values(Role)),
    secondName: string()
});

export const GetPaginatedUsersContract = paginated(GetUserContract);

export const GetUserWithOrganizationContract = object({
    id: string(),
    email: string(),
    firstName: string(),
    organization: GetOrganizationContract,
    patronymic: string(),
    role: enums(Object.values(Role)),
    secondName: string()
});

export const GetPaginatedUsersWithOrganizationContract = paginated(GetUserWithOrganizationContract);
