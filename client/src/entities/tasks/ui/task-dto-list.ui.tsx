import { Card, DataList, Flex, type FlexProps, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { use } from 'react';

import { TaskCategoryBadge } from '~/entities/task-categories/@x/tasks';

import type { TaskDTO } from '../model/task.dto';
import { TaskDangerStatusBadge } from './danger-status-badge.ui';

export type TaskDTOListProps = FlexProps & {
    actions?: (dto: TaskDTO) => ReactNode;
    data: Promise<TaskDTO[]>;
};

export function TaskDTOList({ actions, data, ...props }: TaskDTOListProps) {
    const tasks = use(data);
    return (
        <Flex direction="column" gap="2" {...props}>
            {tasks.map((task, i) => (
                <Card key={i}>
                    <Flex justify="between">
                        <DataList.Root size="1">
                            <DataList.Item>
                                <DataList.Label minWidth="88px">Номер</DataList.Label>
                                <DataList.Value>
                                    <Text>{task.number}</Text>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="88px">Название</DataList.Label>
                                <DataList.Value>
                                    <Text>{task.name}</Text>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="88px">Уровень критичности</DataList.Label>
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
                                <DataList.Label minWidth="88px">CVE</DataList.Label>
                                <Flex asChild gap="2">
                                    <DataList.Value>
                                        {task.CVE?.map((CVE, i) => <Text key={`${CVE}:${i.toString()}`}>{CVE}</Text>)}
                                    </DataList.Value>
                                </Flex>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="88px">BDU</DataList.Label>
                                <Flex asChild gap="2">
                                    <DataList.Value>
                                        {task.BDU?.map((bdu, i) => <Text key={`${bdu}:${i.toString()}`}>{bdu}</Text>)}
                                    </DataList.Value>
                                </Flex>
                            </DataList.Item>
                        </DataList.Root>
                        {!(actions == null) && actions(task)}
                    </Flex>
                </Card>
            ))}
            {tasks.length === 0 && <Text ml="3">Отсутствуют элементы</Text>}
        </Flex>
    );
}
