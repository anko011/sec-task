import { Pagination } from '~/shared/ui/pagination';

import { useTaskNames } from '../model';
import type { TaskNamesTableProps } from './task-names-table.ui';
import { TaskNamesTable } from './task-names-table.ui';

export type PaginatedTaskNamesTableProps = Omit<TaskNamesTableProps, 'data'>;

export function PaginatedTaskNamesTable(props: PaginatedTaskNamesTableProps) {
    const { data } = useTaskNames();
    return (
        <>
            <TaskNamesTable data={data.items} {...props} />
            <Pagination data={data} />
        </>
    );
}
