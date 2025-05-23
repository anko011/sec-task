import { Card, DataList, Flex, type FlexProps, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';

import { TaskCategoryBadge } from '~/entities/task-categories';

import { TaskDangerStatusBadge } from './task-danger-status-badge.ui';
import type { TaskDraft } from '../model/task-draft';

export type TaskDraftListProps = FlexProps & {
    actions?: (dto: TaskDraft) => ReactNode;
    data: TaskDraft[];
};

export function TaskDraftList({ actions, data, ...props }: TaskDraftListProps) {
    return (
        <Flex direction="column" gap="2" {...props}>
            {data.map((task, i) => (
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
                                    <Text>{task.name.title}</Text>
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
                                        {task.cve.map((CVE, i) => (
                                            <Text key={`${CVE}:${i.toString()}`}>{CVE}</Text>
                                        ))}
                                    </DataList.Value>
                                </Flex>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="88px">BDU</DataList.Label>
                                <Flex asChild gap="2">
                                    <DataList.Value>
                                        {task.bdu.map((bdu, i) => (
                                            <Text key={`${bdu}:${i.toString()}`}>{bdu}</Text>
                                        ))}
                                    </DataList.Value>
                                </Flex>
                            </DataList.Item>
                        </DataList.Root>
                        {!(actions == null) && actions(task)}
                    </Flex>
                </Card>
            ))}
            {data.length === 0 && <Text ml="3">Отсутствуют элементы</Text>}
        </Flex>
    );
}
