import { GenericAsyncSelector } from '~/shared/ui/generic-async-selector';

import { GetPaginatedOrganizationsContract } from '../api/contracts';
import type { Organization } from '../model/organization';

export type OrganizationsSelectorProps = {
    name?: string;
    defaultValue?: string;
    onChange?: (type: Organization | undefined) => void;
};

export function OrganizationsSelector(props: OrganizationsSelectorProps) {
    return (
        <GenericAsyncSelector
            endpoint="/organizations"
            parse={(data) => GetPaginatedOrganizationsContract.parse(data)}
            displayField="name"
            queryParam="name"
            placeholder="Введите название организации"
            {...props}
        />
    );
}
