import { Pagination } from '~/shared/ui/pagination';

import { useTaskPackages } from '../model';
import type { TaskPackagesTableProps } from './task-packages-table.ui';
import { TaskPackagesTable } from './task-packages-table.ui';

export type PaginatedTaskPackagesTableProps = Omit<TaskPackagesTableProps, 'data'>;

export function PaginatedTaskPackagesTable(props: PaginatedTaskPackagesTableProps) {
    const { data } = useTaskPackages();
    return (
        <>
            <TaskPackagesTable data={data.items} {...props} />
            <Pagination data={data} />
        </>
    );
}
