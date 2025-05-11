import type { BadgeProps } from '@radix-ui/themes';
import { Badge, Button, DataList, Flex, Heading, Separator, Text } from '@radix-ui/themes';
import { Accordion } from 'radix-ui';
import { Fragment, Suspense } from 'react';
import useSWR from 'swr';

import { findAllOrganizations } from '~/entities/organizations';
import type { Task } from '~/entities/tasks';
import { TaskInfoList, TaskStatus } from '~/entities/tasks';
import { Role, useCurrentUser } from '~/entities/users';
import { ChangeTaskStatusButton } from '~/pages/task-package/task-package.page';
import { axiosInstance } from '~/shared/api';
import { Loader } from '~/shared/ui/loader';

// function groupBy<T>(array: T[], getKey: (item: T) => string | number): Record<string, T[]> {
//     return array.reduce<Record<string, T[]>>((result, item) => {
//         const key = String(getKey(item));
//         if (result[key] == null) {
//             result[key] = [];
//         }
//         result[key].push(item);
//         return result;
//     }, {});
// }

function TaskStatusBadge({ status }: { status: TaskStatus }) {
    const map: Record<TaskStatus, { color: BadgeProps['color']; text: string }> = {
        [TaskStatus.COMPENSATED]: { color: 'jade', text: 'Приняты компенсирующие меры' },
        [TaskStatus.COMPLETED]: { color: 'jade', text: 'Завершено' },
        [TaskStatus.IN_PROGRESS]: { color: 'yellow', text: 'В процессе' },
        [TaskStatus.NEW]: { color: 'blue', text: 'Новый' },
        [TaskStatus.NO_ACTUAL]: { color: 'yellow', text: 'Не актуальный' }
    };

    const { color, text } = map[status];
    return <Badge color={color}>{text}</Badge>;
}

export function TasksStatusHistoryByOrganization({
    organizationId,
    packageId,
    taskId
}: {
    organizationId: string;
    packageId: string;
    taskId: string;
}) {
    const { data: executions } = useSWR(
        ['executions', packageId, taskId],
        async () => {
            const response = await axiosInstance.get<
                {
                    organizationId: string;
                    status: TaskStatus;
                    statusHistory: {
                        changedAt: string;
                        comment: string;
                        newStatus: TaskStatus;
                        oldStatus?: TaskStatus;
                    }[];
                    taskId: string;
                }[]
            >(`task-packages/${packageId}/tasks/${taskId}/executions`);
            return response.data;
        },
        { suspense: true }
    );

    const filtered = executions.filter((exec) => exec.organizationId === organizationId);
    return <TaskStatusHistory histories={filtered.at(0)?.statusHistory ?? []} />;
}

function TaskStatusHistory({
    histories
}: {
    histories: {
        changedAt: string;
        comment: string;
        newStatus: TaskStatus;
        oldStatus?: TaskStatus;
    }[];
}) {
    return (
        <Flex direction="column" gap="2" mt="2">
            {histories.map((history, i) => (
                <Fragment key={history.changedAt}>
                    {i !== 0 && <Separator my="2" size="4" />}
                    <Flex key={history.changedAt}>
                        <Flex align="start" gap="2" minWidth="450px">
                            <Text size="2">{new Date(history.changedAt).toLocaleDateString('ru-RU')}</Text>
                            {history.oldStatus !== undefined && (
                                <>
                                    <TaskStatusBadge status={history.oldStatus} /> →
                                </>
                            )}
                            <TaskStatusBadge status={history.newStatus} />
                        </Flex>
                        <Text size="2">{history.comment}</Text>
                    </Flex>
                </Fragment>
            ))}
            {histories.length === 0 && <Text size="2">Отсутствует история</Text>}
        </Flex>
    );
}

export function TaskStatusHistoryAccordion({ packageId, taskId }: { packageId: string; taskId: string }) {
    const { data: executions } = useSWR(
        ['executions', packageId, taskId],
        async () => {
            const response = await axiosInstance.get<
                {
                    organizationId: string;
                    status: TaskStatus;
                    statusHistory: {
                        changedAt: string;
                        comment: string;
                        newStatus: TaskStatus;
                        oldStatus?: TaskStatus;
                    }[];
                    taskId: string;
                }[]
            >(`task-packages/${packageId}/tasks/${taskId}/executions`);
            return response.data;
        },
        { suspense: true }
    );

    const {
        data: { items: organizations }
    } = useSWR('organizations-', () => findAllOrganizations({ limit: 100000 }), { suspense: true });

    if (!executions.length) return <Text color="gray">Нет изменений статусов</Text>;

    return (
        <Accordion.Root asChild style={{ marginBottom: '1rem' }} type="multiple">
            <Flex direction="column" gap="4">
                {executions.map((execute) => (
                    <Accordion.Item key={execute.organizationId} value={execute.organizationId}>
                        <Accordion.Header asChild>
                            <Flex justify="between">
                                <DataList.Root size="1">
                                    <DataList.Item>
                                        <DataList.Label>Организация</DataList.Label>
                                        <DataList.Value>
                                            {organizations.find((org) => org.id === execute.organizationId)?.name}
                                        </DataList.Value>
                                    </DataList.Item>
                                    <DataList.Item>
                                        <DataList.Label>Последний статус</DataList.Label>
                                        <DataList.Value>
                                            <TaskStatusBadge status={execute.status} />
                                        </DataList.Value>
                                    </DataList.Item>
                                </DataList.Root>
                                <Flex gap="2">
                                    <ChangeTaskStatusButton
                                        organizationId={execute.organizationId}
                                        packageId={packageId}
                                        status={execute.status}
                                        taskId={taskId}
                                    />
                                    <Accordion.Trigger asChild>
                                        <Button variant="surface">Открыть историю</Button>
                                    </Accordion.Trigger>
                                </Flex>
                            </Flex>
                        </Accordion.Header>

                        <Accordion.Content>
                            <TaskStatusHistory histories={execute.statusHistory} />
                        </Accordion.Content>
                    </Accordion.Item>
                ))}
            </Flex>
        </Accordion.Root>
    );
}

export function TaskDetail({ packageId, task }: { packageId: string; task: Task }) {
    const { user } = useCurrentUser();
    if (user == null) throw new Error('Component should be mounted when user auth');

    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Suspense fallback={<Loader />}>
                <Heading size="4">Информация о задаче</Heading>
                <Separator size="4" />

                <TaskInfoList packageId={packageId} task={task} />

                <Heading size="4">Описание</Heading>
                <Separator size="4" />
                <Text size="2" wrap="pretty">
                    {task.description}
                </Text>

                {task.additionalInformation != null && task.additionalInformation !== '' && (
                    <>
                        <Heading size="4">Дополнительные сведения</Heading>
                        <Separator size="4" />
                        <Text size="2" wrap="pretty">
                            {task.additionalInformation}
                        </Text>
                    </>
                )}

                <Heading size="4">История выполнения</Heading>
                <Separator size="4" />
                <Suspense fallback={<Loader />}>
                    {user.role === Role.Assigner ? (
                        <TasksStatusHistoryByOrganization
                            organizationId={user.organizationId}
                            packageId={packageId}
                            taskId={task.id}
                        />
                    ) : (
                        <TaskStatusHistoryAccordion packageId={packageId} taskId={task.id} />
                    )}
                </Suspense>
            </Suspense>
        </Flex>
    );
}
