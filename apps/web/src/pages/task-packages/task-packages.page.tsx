import { Flex } from '@radix-ui/themes';
import { Suspense } from 'react';

import { TaskPackagesRepository, TaskPackagesTable } from '~/entities/task-packages';
import { CreateTaskPackageButton } from '~/features/task-packages/create';
import { DeleteTaskPackageButton } from '~/features/task-packages/delete';
import { EditTaskPackageButton } from '~/features/task-packages/edit';
import { FilterTaskPackagesStatusSelector } from '~/features/task-packages/filter';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { SearchField } from '~/shared/ui/search-field';

const taskPackages = TaskPackagesRepository.getAll();

export function TaskPackagesPage() {
    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Suspense fallback={<Loader />}>
                <Flex align="center" gap="2">
                    <CreateTaskPackageButton />
                    <SearchField placeholder="Название пакета задачи..." />
                    <FilterTaskPackagesStatusSelector />
                </Flex>

                <TaskPackagesTable
                    action={(taskPackage) => (
                        <Flex gap="2">
                            <EditTaskPackageButton taskPackage={taskPackage} />
                            <DeleteTaskPackageButton taskPackage={taskPackage} />
                        </Flex>
                    )}
                    data={taskPackages}
                />

                <Pagination currentPage={5} totalPages={10} />
            </Suspense>
        </Flex>
    );
}
