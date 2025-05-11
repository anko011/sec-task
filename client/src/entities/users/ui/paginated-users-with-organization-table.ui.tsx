import { useUsersWithOrganization } from '~/entities/users';
import { Pagination } from '~/shared/ui/pagination';

import type { UsersWithOrganizationTableProps } from './users-with-organization-table.ui';
import { UsersWithOrganizationTable } from './users-with-organization-table.ui';

export type PaginatedUsersWithOrganizationTableProps = Omit<UsersWithOrganizationTableProps, 'data'>;

export function PaginatedUsersWithOrganizationTable(props: PaginatedUsersWithOrganizationTableProps) {
    const { data } = useUsersWithOrganization();
    return (
        <>
            <UsersWithOrganizationTable data={data.items} {...props} />
            <Pagination data={data} />
        </>
    );
}
