import { Badge, Card, DataList, Flex, type FlexProps, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { use } from 'react';

import { TaskCategoryBadge } from '~/entities/task-categories/@x/tasks';
import { Link } from '~/shared/ui/link';

import type { TaskDTO } from '../model/task.dto';
import { TaskDangerStatusBadge } from './danger-status-badge.ui';

export type TaskDTOListProps = FlexProps & {
    actions?: (dto: TaskDTO) => ReactNode;
    data: Promise<TaskDTO[]>;
};

//TODO: Перенести файлы в Task

const files = [
    { id: '1', name: 'Документ 1', url: '/' },
    { id: '2', name: 'Документ 2', url: '/' }
];

export function TaskDTOList({ actions, data, ...props }: TaskDTOListProps) {
    const tasks = use(data);
    return (
        <Flex direction="column" gap="2" {...props}>
            {tasks.map((task, i) => (
                <Card key={i}>
                    <Flex justify="between">
                        <DataList.Root size="1">
                            <DataList.Item>
                                <DataList.Label minWidth="88px">Название</DataList.Label>
                                <DataList.Value>
                                    <Text>{task.name}</Text>
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
                                <DataList.Label minWidth="88px">Исполнители</DataList.Label>
                                <DataList.Value>
                                    <Flex gap="2">
                                        {task.assignees.map((assignee) => (
                                            <Badge key={assignee.id}>
                                                {assignee.firstName} {assignee.secondName}
                                            </Badge>
                                        ))}
                                    </Flex>
                                    {task.assignees.length === 0 && <Text>Не установлены исполнители</Text>}
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="88px">Прикрепленные файлы</DataList.Label>
                                <DataList.Value>
                                    <Flex gap="2">
                                        {files.map((file) => (
                                            <Link asChild key={file.id} to={file.url}>
                                                <Badge key={file.id}>{file.name}</Badge>
                                            </Link>
                                        ))}
                                    </Flex>
                                </DataList.Value>
                            </DataList.Item>
                        </DataList.Root>
                        {!(actions == null) && actions(task)}
                    </Flex>
                </Card>
            ))}
        </Flex>
    );
}
