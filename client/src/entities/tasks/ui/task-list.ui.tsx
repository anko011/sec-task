import type { FlexProps } from '@radix-ui/themes';
import { Button, Card, DataList, Dialog, Flex, Progress, ScrollArea, Text } from '@radix-ui/themes';
import { Suspense, use } from 'react';

import { TaskCategoryBadge } from '~/entities/task-categories/@x/tasks';
import { TaskDetail } from '~/entities/tasks';
import { Loader } from '~/shared/ui/loader';

import type { Task } from '../model/task';
import { TaskDangerStatusBadge } from './danger-status-badge.ui';

export type TaskListProps = FlexProps & {
    data: Promise<Task[]>;
    packageId: string;
};

export function TasksList({ data, packageId, ...props }: TaskListProps) {
    const tasks = use(data);
    return (
        <Flex direction="column" gap="2" {...props}>
            {tasks.map((task) => (
                <Card key={task.id}>
                    <DataList.Root key={task.id} size="1">
                        <DataList.Item>
                            <DataList.Label minWidth="88px">Номер</DataList.Label>
                            <DataList.Value>
                                <Dialog.Root>
                                    <Dialog.Trigger>
                                        <Button ml="1" size="1" variant="ghost">
                                            358965
                                        </Button>
                                    </Dialog.Trigger>
                                    <Dialog.Content minWidth="80vw">
                                        <Dialog.Title>{task.name}</Dialog.Title>
                                        <ScrollArea style={{ height: '80vh' }}>
                                            <Suspense fallback={<Loader />}>
                                                <TaskDetail packageId={packageId} taskId={task.id} />
                                            </Suspense>
                                        </ScrollArea>
                                    </Dialog.Content>
                                </Dialog.Root>
                            </DataList.Value>
                        </DataList.Item>

                        <DataList.Item>
                            <DataList.Label minWidth="88px">Наименование</DataList.Label>
                            <DataList.Value>{task.name}</DataList.Value>
                        </DataList.Item>

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
                            <DataList.Value>123</DataList.Value>
                        </DataList.Item>

                        <DataList.Item>
                            <DataList.Label minWidth="88px">BDU</DataList.Label>
                            <DataList.Value>123</DataList.Value>
                        </DataList.Item>

                        <DataList.Item>
                            <DataList.Label minWidth="88px">Срок исполнения</DataList.Label>
                            <DataList.Value>
                                <Text>{new Date(2025, 11, 20).toLocaleDateString('ru')}</Text>
                            </DataList.Value>
                        </DataList.Item>

                        <DataList.Item>
                            <DataList.Label minWidth="88px">Дата исполнения</DataList.Label>
                            <DataList.Value>
                                <Text>{new Date(2025, 11, 22).toLocaleDateString('ru')}</Text>
                            </DataList.Value>
                        </DataList.Item>

                        <DataList.Item>
                            <DataList.Label minWidth="88px">Прогресс</DataList.Label>
                            <DataList.Value>
                                <Progress highContrast mt="1" size="3" value={Math.random() * 100} />
                            </DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                </Card>
            ))}
        </Flex>
    );
}
