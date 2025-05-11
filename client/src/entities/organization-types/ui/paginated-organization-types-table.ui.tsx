import { Pagination } from '~/shared/ui/pagination';

import { useOrganizationTypes } from '../model';
import type { OrganizationTypesTableProps } from './organization-types-table.ui';
import { OrganizationTypesTable } from './organization-types-table.ui';

export type PaginatedOrganizationTypesTableProps = Omit<OrganizationTypesTableProps, 'data'>;

export function PaginatedOrganizationTypesTable(props: PaginatedOrganizationTypesTableProps) {
    const { data } = useOrganizationTypes();
    return (
        <>
            <OrganizationTypesTable data={data.items} {...props} />
            <Pagination data={data} />
        </>
    );
}
