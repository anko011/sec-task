import type { FlexProps } from '@radix-ui/themes';
import { Card, DataList, Dialog, Flex, Link, Progress, ScrollArea, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import useSWR from 'swr';

import { TaskCategoryBadge } from '~/entities/task-categories';
import type { TaskStatus } from '~/entities/tasks';
import { TaskDetail, TaskStatusBadge } from '~/entities/tasks';
import { Role, useCurrentUser } from '~/entities/users';
import { axiosInstance } from '~/shared/api';
import { Loader } from '~/shared/ui/loader';

import type { Task } from '../model/task';
import { TaskDangerStatusBadge } from './danger-status-badge.ui';

export type TaskListProps = FlexProps & {
    actions?: (task: Task) => ReactNode;
    data: Task[];
    packageId: string;
};

export function TasksList({ actions, data, packageId, ...props }: TaskListProps) {
    const { user } = useCurrentUser();

    const { data: extensions } = useSWR(
        user?.role === Role.Assigner ? 'exchangeByOrg' : null,
        () => {
            return Promise.all(
                data.map(async (task: Task) => {
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
                    >(
                        `task-packages/${packageId}/tasks/${task.id}/executions?organizationId=${user?.organizationId ?? ''}`
                    );
                    return response.data;
                })
            );
        },
        { suspense: true }
    );

    const getStatus = (task: Task) => {
        return extensions.flat().find((t) => t.taskId === task.id)?.status as TaskStatus;
    };

    return (
        <Flex direction="column" gap="2" {...props}>
            {data.map((task) => (
                <Card key={task.id}>
                    <Flex justify="between">
                        <DataList.Root key={task.id} size="1" style={{ flex: 1 }}>
                            <DataList.Item>
                                <DataList.Label minWidth="88px">Номер</DataList.Label>
                                <DataList.Value>
                                    <Dialog.Root>
                                        <Dialog.Trigger>
                                            <Link size="1" style={{ cursor: 'var(--cursor-link)' }}>
                                                {task.number}
                                            </Link>
                                        </Dialog.Trigger>
                                        <Dialog.Content minWidth="80vw">
                                            <Dialog.Title>{task.name.name}</Dialog.Title>
                                            <ScrollArea style={{ height: '80vh' }}>
                                                <Suspense fallback={<Loader />}>
                                                    <TaskDetail packageId={packageId} task={task} />
                                                </Suspense>
                                            </ScrollArea>
                                        </Dialog.Content>
                                    </Dialog.Root>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="88px">Наименование</DataList.Label>
                                <DataList.Value>{task.name.name}</DataList.Value>
                            </DataList.Item>

                            {user?.role === Role.Assigner && (
                                <DataList.Item>
                                    <DataList.Label minWidth="88px">Статус</DataList.Label>
                                    <DataList.Value>
                                        <TaskStatusBadge status={getStatus(task)} />
                                    </DataList.Value>
                                </DataList.Item>
                            )}

                            <DataList.Item>
                                <DataList.Label minWidth="88px">Категория задачи</DataList.Label>
                                <DataList.Value>
                                    <TaskCategoryBadge category={task.category} />
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="88px">Уровень критичности</DataList.Label>
                                <DataList.Value>
                                    <TaskDangerStatusBadge status={task.dangerStatus} />
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="88px">CVE</DataList.Label>
                                <DataList.Value>{task.CVE?.join(', ')}</DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="88px">BDU</DataList.Label>
                                <DataList.Value>{task.BDU?.join(', ')}</DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="88px">Срок исполнения</DataList.Label>
                                <DataList.Value>
                                    <Text>{task.deadline.toLocaleDateString('ru-RU')}</Text>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="88px">Дата исполнения</DataList.Label>
                                <DataList.Value>
                                    <Text> - </Text>
                                </DataList.Value>
                            </DataList.Item>
                            {user?.role === Role.Admin ||
                                (user?.role === Role.Operator && (
                                    <DataList.Item>
                                        <DataList.Label minWidth="88px">Прогресс</DataList.Label>
                                        <DataList.Value>
                                            <Progress highContrast mt="1" size="3" value={task.progress.percentage} />
                                        </DataList.Value>
                                    </DataList.Item>
                                ))}
                        </DataList.Root>
                        {actions?.(task)}
                    </Flex>
                </Card>
            ))}
        </Flex>
    );
}
