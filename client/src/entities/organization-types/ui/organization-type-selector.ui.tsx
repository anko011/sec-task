import { GenericAsyncSelector } from '~/shared/ui/generic-async-selector';

import type { OrganizationType } from '../model/organization-type';
import { GetPaginatedOrganizationTypesContract } from '../api/contracts';

export type OrganizationTypesSelectorProps = {
    name?: string;
    defaultValue?: string;
    onChange?: (type: OrganizationType | undefined) => void;
};

export function OrganizationTypesSelector(props: OrganizationTypesSelectorProps) {
    return (
        <GenericAsyncSelector
            endpoint="/organization-types"
            parse={(data) => GetPaginatedOrganizationTypesContract.parse(data)}
            displayField="title"
            queryParam="title"
            placeholder="Введите название типа"
            {...props}
        />
    );
}
