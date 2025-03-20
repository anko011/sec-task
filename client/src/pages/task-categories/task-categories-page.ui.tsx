import { Flex } from '@radix-ui/themes';
import { Suspense } from 'react';

import { TaskCategoriesRepository, TaskCategoriesTable } from '~/entities/task-categories';
import { CreateTaskCategoryButton } from '~/features/task-categories/create';
import { DeleteTaskCategoryButton } from '~/features/task-categories/delete';
import { EditTaskCategoryButton } from '~/features/task-categories/edit';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { SearchField } from '~/shared/ui/search-field';

export function TaskCategoriesPage() {
    const categories = TaskCategoriesRepository.getAll();
    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Suspense fallback={<Loader />}>
                <Flex align="center" gap="2">
                    <CreateTaskCategoryButton />
                    <SearchField placeholder="Название категории..." />
                </Flex>

                <TaskCategoriesTable
                    action={(category) => (
                        <Flex gap="2">
                            <EditTaskCategoryButton category={category} />
                            <DeleteTaskCategoryButton category={category} />
                        </Flex>
                    )}
                    data={categories}
                />
                <Pagination currentPage={5} totalPages={10} />
            </Suspense>
        </Flex>
    );
}
