import { useTaskCategories } from '~/entities/task-categories/model';
import { Pagination } from '~/shared/ui/pagination';

import type { TaskCategoriesTableProps } from './task-categories-table.ui';
import { TaskCategoriesTable } from './task-categories-table.ui';

export type PaginatedTaskCategoryTableProps = Omit<TaskCategoriesTableProps, 'data'>;

export function PaginatedTaskCategoryTable(props: PaginatedTaskCategoryTableProps) {
    const { data } = useTaskCategories();
    return (
        <>
            <TaskCategoriesTable data={data.items} {...props} />
            <Pagination data={data} />
        </>
    );
}
