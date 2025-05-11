import { Badge, DataList, Table, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';

import { Link } from '~/shared/ui/link';

import type { TaskPackage } from '../model/task-package';
import { TaskPackageStatus } from '../model/task-package';

export type TaskPackagesTableProps = Table.RootProps & {
    actionEnd?: {
        title: string;
        action: (taskPackage: TaskPackage) => ReactNode;
    };
    actionStart?: {
        title: string;
        action: (taskPackage: TaskPackage) => ReactNode;
    };
    data: TaskPackage[];
};

export function TaskPackagesTable({ actionEnd, actionStart, data, ...props }: TaskPackagesTableProps) {
    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row>
                    {actionStart != null && <Table.ColumnHeaderCell>{actionStart.title}</Table.ColumnHeaderCell>}
                    <Table.ColumnHeaderCell>Реквизиты пакета</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Отчетный период</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Количество задач</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Количество исполнителей</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Дата создания</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Срок исполнения</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Статус</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Сводка</Table.ColumnHeaderCell>
                    {actionEnd != null && (
                        <Table.ColumnHeaderCell width="72px">{actionEnd.title}</Table.ColumnHeaderCell>
                    )}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {data.map((taskPackage) => (
                    <Table.Row align="center" key={taskPackage.id}>
                        {actionStart != null && <Table.Cell>{actionStart.action(taskPackage)}</Table.Cell>}
                        <Table.Cell>
                            <DataList.Root size="1" style={{ gap: '6px' }}>
                                <DataList.Item>
                                    <DataList.Label>Входящий</DataList.Label>
                                    <DataList.Value>{taskPackage.incomingRequisite}</DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label>Исходящий</DataList.Label>
                                    <DataList.Value>
                                        <Link to={`/task-packages/${taskPackage.id}`}>
                                            <Text>{taskPackage.outgoingRequisite}</Text>
                                        </Link>
                                    </DataList.Value>
                                </DataList.Item>
                            </DataList.Root>
                        </Table.Cell>
                        <Table.RowHeaderCell>
                            {taskPackage.reportDeadline.deadline.toLocaleDateString('ru-RU', { dateStyle: 'medium' })}
                        </Table.RowHeaderCell>
                        <Table.Cell>{taskPackage.tasksCount}</Table.Cell>
                        <Table.Cell>{taskPackage.assignedOrganizationCount}</Table.Cell>
                        <Table.Cell>
                            {taskPackage.createdAt.toLocaleDateString('ru-RU', { dateStyle: 'medium' })}
                        </Table.Cell>
                        <Table.Cell>
                            {taskPackage.submissionData.toLocaleDateString('ru-RU', { dateStyle: 'medium' })}
                        </Table.Cell>
                        <Table.Cell>
                            <Badge color={taskPackage.status === TaskPackageStatus.ACTIVE ? 'jade' : 'orange'}>
                                {taskPackage.status === TaskPackageStatus.FIXED ? 'Зафиксирован' : 'Активен'}
                            </Badge>
                        </Table.Cell>
                        <Table.Cell>0 / {taskPackage.tasksCount}</Table.Cell>

                        {actionEnd != null && <Table.Cell>{actionEnd.action(taskPackage)}</Table.Cell>}
                    </Table.Row>
                ))}
                {data.length === 0 && (
                    <Table.Row>
                        <Table.Cell colSpan={10}>
                            <Text>Отсутствуют элементы</Text>
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table.Root>
    );
}
