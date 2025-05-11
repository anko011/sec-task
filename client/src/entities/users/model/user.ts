import type { Organization } from '~/entities/organizations';

export enum Role {
    Admin = 'admin',
    Assigner = 'assigner',
    Operator = 'operator'
}

export type User = {
    id: string;
    email: string;
    firstName: string;
    organizationId: string;
    patronymic: string;
    role: Role;
    secondName: string;
};

export type UserWithOrganization = Omit<User, 'organizationId'> & {
    organization: Organization;
};
