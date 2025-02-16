import type { FlexProps } from '@radix-ui/themes';
import { Card, DataList, Flex, Progress, Text } from '@radix-ui/themes';
import { use } from 'react';

import { TaskCategoryBadge } from '~/entities/task-categories/@x/tasks';
import { Link } from '~/shared/ui/link';

import type { Task } from '../model/task';
import { TaskDangerStatusBadge } from './danger-status-badge.ui';

export type TaskListProps = FlexProps & {
    data: Promise<Task[]>;
};

export function TasksList({ data, ...props }: TaskListProps) {
    const tasks = use(data);
    return (
        <Flex direction="column" gap="2" {...props}>
            {tasks.map((task) => (
                <Card key={task.id}>
                    <DataList.Root key={task.id} size="1">
                        <DataList.Item>
                            <DataList.Label minWidth="88px">Название</DataList.Label>
                            <DataList.Value>
                                <Link to={`tasks/${task.id}`}>{task.name}</Link>
                            </DataList.Value>
                        </DataList.Item>

                        <DataList.Item>
                            <DataList.Label minWidth="88px">Статус опасности</DataList.Label>
                            <DataList.Value>
                                <TaskDangerStatusBadge status={task.dangerStatus} />
                            </DataList.Value>
                        </DataList.Item>

                        <DataList.Item>
                            <DataList.Label minWidth="88px">Категория задачи</DataList.Label>
                            <DataList.Value>
                                <TaskCategoryBadge category={task.category} />
                            </DataList.Value>
                        </DataList.Item>

                        <DataList.Item>
                            <DataList.Label minWidth="88px">Срок дедлайна</DataList.Label>
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
