import { Badge, DataList, Flex } from '@radix-ui/themes';
import { Suspense, use } from 'react';
import { useParams } from 'react-router';

import { SearchableOrganizationTable } from '~/entities/organizations';
import type { TaskPackage } from '~/entities/task-packages';
import { TaskPackagesRepository } from '~/entities/task-packages';
import { TasksList, TasksRepository } from '~/entities/tasks';
import { FilterTaskCategorySelector } from '~/features/task-categories/filter';
import { FilterTaskDangerStatusSelector } from '~/features/tasks/filter';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { SearchField } from '~/shared/ui/search-field';

function TaskPackageDetail({ data }: { data: Promise<TaskPackage> }) {
    const taskPackage = use(data);
    const tasks = TasksRepository.getPackageTasks(taskPackage.id);
    return (
        <DataList.Root size="2">
            <DataList.Item align="center">
                <DataList.Label>Входящий реквизит</DataList.Label>
                <DataList.Value>{taskPackage.incomingRequisite}</DataList.Value>
            </DataList.Item>

            <DataList.Item align="center">
                <DataList.Label>Исходящий реквизит</DataList.Label>
                <DataList.Value>{taskPackage.outgoingRequisite}</DataList.Value>
            </DataList.Item>

            <DataList.Item align="center">
                <DataList.Label>Прикрепленные файлы</DataList.Label>
                <Flex asChild gap="2">
                    <DataList.Value>
                        <Badge>Файл #1.docx</Badge>
                        <Badge>Файл #2.docx</Badge>
                        <Badge>Файл #3.docx</Badge>
                        <Badge>Файл #4.docx</Badge>
                    </DataList.Value>
                </Flex>
            </DataList.Item>

            <DataList.Item align="center">
                <DataList.Label>Исполнители</DataList.Label>
                <Flex asChild direction="column" gap="2">
                    <DataList.Value>
                        <SearchableOrganizationTable />
                    </DataList.Value>
                </Flex>
            </DataList.Item>

            <DataList.Item align="center">
                <DataList.Label>Задачи</DataList.Label>
                <Flex asChild direction="column" gap="2">
                    <DataList.Value>
                        <Flex gap="2">
                            <SearchField placeholder="Название задачи..." />
                            <FilterTaskCategorySelector />
                            <FilterTaskDangerStatusSelector />
                        </Flex>
                        <Suspense fallback={<Loader />}>
                            <TasksList data={Promise.resolve(tasks)} packageId={taskPackage.id} />
                            <Pagination currentPage={1} totalPages={Promise.resolve(10)} />
                        </Suspense>
                    </DataList.Value>
                </Flex>
            </DataList.Item>
        </DataList.Root>
    );
}

export function TaskPackagePage() {
    const params = useParams();
    const packageId = params.id ?? '';
    const taskPack = TaskPackagesRepository.getById(packageId);

    return (
        <Flex direction="column" gap="4" minHeight="100%" p="4">
            <Suspense fallback={<Loader />}>
                <TaskPackageDetail data={taskPack} />
            </Suspense>
        </Flex>
    );
}
