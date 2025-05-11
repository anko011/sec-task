import { Pagination } from '~/shared/ui/pagination';

import { useOrganizations } from '../model';
import type { OrganizationTableProps } from './organization-table.ui';
import { OrganizationsTable } from './organization-table.ui';

export type PaginatedOrganizationsTableProps = Omit<OrganizationTableProps, 'data'>;

export function PaginatedOrganizationsTable(props: PaginatedOrganizationsTableProps) {
    const { data } = useOrganizations();

    return (
        <>
            <OrganizationsTable data={data.items} {...props} />
            <Pagination data={data} />
        </>
    );
}
