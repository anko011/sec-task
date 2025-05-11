import { Flex } from '@radix-ui/themes';
import React, { Suspense } from 'react';
import { useSearchParams } from 'react-router';

import { PaginatedTaskCategoryTable } from '~/entities/task-categories';
import { CreateTaskCategoryButton } from '~/features/task-categories/create';
import { DeleteTaskCategoryButton } from '~/features/task-categories/delete';
import { EditTaskCategoryButton } from '~/features/task-categories/edit';
import { SearchTaskCategoriesByName } from '~/features/task-categories/filter';
import { Loader } from '~/shared/ui/loader';

export function TaskCategoriesPage() {
    const [searchParams] = useSearchParams();
    const key = [...searchParams.values()].join();

    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Flex gap="2">
                <CreateTaskCategoryButton />
                <SearchTaskCategoriesByName />
            </Flex>

            <Suspense fallback={<Loader />} key={key}>
                <PaginatedTaskCategoryTable
                    actionEnd={{
                        title: '',
                        action: (taskCategory) => (
                            <Flex gap="2">
                                <EditTaskCategoryButton taskCategory={taskCategory} />
                                <DeleteTaskCategoryButton taskCategory={taskCategory} />
                            </Flex>
                        )
                    }}
                />
            </Suspense>
        </Flex>
    );
}
