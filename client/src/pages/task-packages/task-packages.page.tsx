import { Flex } from '@radix-ui/themes';
import type { ChangeEvent } from 'react';
import { Suspense, useCallback, useState } from 'react';

import type { TaskPackageStatus } from '~/entities/task-packages';
import { TaskPackagesRepository, TaskPackagesTable } from '~/entities/task-packages';
import { CreateTaskPackageButton } from '~/features/task-packages/create';
import { DeleteTaskPackageButton } from '~/features/task-packages/delete';
import { EditTaskPackageButton } from '~/features/task-packages/edit';
import { FilterTaskPackagesStatusSelector } from '~/features/task-packages/filter';
import { FixTaskPackageButton } from '~/features/task-packages/fix';
import { SignTaskPackageButton } from '~/features/task-packages/sign';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { SearchField } from '~/shared/ui/search-field';

const ITEMS_PER_PAGE = 10;

export function TaskPackagesPage() {
    const [offset, setOffset] = useState(0);
    const [incomingRequisite, setIncomingRequisite] = useState('');
    const [outgoingRequisite, setOutgoingRequisite] = useState('');
    const [status, setStatus] = useState<TaskPackageStatus | undefined>();

    const taskPackagesPromise = TaskPackagesRepository.findAll(
        { incomingRequisite, outgoingRequisite, status },
        { limit: ITEMS_PER_PAGE, offset }
    );

    const currentPage = offset / ITEMS_PER_PAGE + 1;
    const totalPages = taskPackagesPromise.then(({ total }) => Math.ceil(total / ITEMS_PER_PAGE));

    const handleSearchIncoming = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setIncomingRequisite(e.target.value);
    }, []);

    const handleSearchOutgoing = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setOutgoingRequisite(e.target.value);
    }, []);

    const handleStatusChange = useCallback((status: TaskPackageStatus | undefined) => {
        setStatus(status);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setOffset((page - 1) * ITEMS_PER_PAGE);
    }, []);

    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Flex align="center" gap="2">
                <CreateTaskPackageButton />
                <SearchField onChange={handleSearchIncoming} placeholder="Входящий реквезит" />
                <SearchField onChange={handleSearchOutgoing} placeholder="Исходящий реквезит" />
                <FilterTaskPackagesStatusSelector onChange={handleStatusChange} />
            </Flex>

            <Suspense fallback={<Loader />}>
                <TaskPackagesTable
                    actionEnd={{
                        title: 'Блок управления',
                        action: (taskPackage) => (
                            <Flex gap="2">
                                <EditTaskPackageButton taskPackage={taskPackage} />
                                <DeleteTaskPackageButton taskPackage={taskPackage} />
                                <FixTaskPackageButton />
                                <SignTaskPackageButton />
                            </Flex>
                        )
                    }}
                    data={taskPackagesPromise.then(({ items }) => items)}
                />

                <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
            </Suspense>
        </Flex>
    );
}
