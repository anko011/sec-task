import { Flex, Heading, Separator } from '@radix-ui/themes';
import { Suspense } from 'react';
import { useParams } from 'react-router';

import { TaskInfoList, TaskProgressTable, TasksRepository } from '~/entities/tasks';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { SearchField } from '~/shared/ui/search-field';

export function TaskPage() {
    const { id: packageId, taskId } = useParams();
    if (packageId == null || taskId == null) throw new Error('Not valid params');

    const task = TasksRepository.getTask(packageId, taskId);

    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Suspense fallback={<Loader />}>
                <Heading size="4">Информация о задаче</Heading>
                <Separator size="4" />

                <TaskInfoList data={task} />

                <Heading size="4">Исполнители</Heading>
                <Separator size="4" />

                <Flex align="center" gap="2">
                    <SearchField placeholder="Название организации..." />
                </Flex>

                <TaskProgressTable data={task} />

                <Pagination currentPage={5} totalPages={10} />
            </Suspense>
        </Flex>
    );
}
