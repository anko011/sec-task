import type { OrganizationType } from '~/entities/organization-types';

export type Organization = {
    id: string;
    type: OrganizationType;
    name: string;
    isArchived: boolean;
};
