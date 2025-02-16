import type { Organization } from '~/entities/organizations';

export type Assignee = {
    id: string;
    firstName: string;
    organization: Organization;
    secondName: string;
};
