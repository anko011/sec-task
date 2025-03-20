import type { OrganizationType } from '~/entities/organization-types/@x/organizations';

export type Organization = {
    id: string;
    type: OrganizationType;
    name: string;
    isArchived: boolean;
};
