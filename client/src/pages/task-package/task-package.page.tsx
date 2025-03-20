import { Button, Flex, Heading, Separator } from '@radix-ui/themes';
import { Suspense } from 'react';
import { useParams } from 'react-router';

import { TaskPackageInfoList, TaskPackagesRepository } from '~/entities/task-packages';
import { TasksList, TasksRepository } from '~/entities/tasks';
import { FilterTaskCategorySelector } from '~/features/task-categories/filter';
import { FilterTaskDangerStatusSelector } from '~/features/tasks/filter';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { SearchField } from '~/shared/ui/search-field';

export function TaskPackagePage() {
    const params = useParams();
    const taskPack = TaskPackagesRepository.getById(params.id ?? '');
    const tasks = TasksRepository.getPackageTasks(params.id ?? '');

    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Suspense fallback={<Loader />}>
                <Heading size="4">Информация о пакете</Heading>
                <Separator size="4" />

                <TaskPackageInfoList data={taskPack} />

                <Heading size="4">Задачи</Heading>
                <Separator size="4" />

                <Flex align="center" gap="2">
                    <SearchField placeholder="Название задачи..." />
                    <FilterTaskCategorySelector />
                    <FilterTaskDangerStatusSelector />
                </Flex>

                <TasksList data={tasks} />

                <Flex align="center" justify="between">
                    <Pagination currentPage={5} totalPages={10} />
                    <Button>Зафиксировать</Button>
                </Flex>
            </Suspense>
        </Flex>
    );
}
