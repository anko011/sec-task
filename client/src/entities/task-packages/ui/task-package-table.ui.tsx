import { Badge, DataList, Table, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';

import { Link } from '~/shared/ui/link';

import { type TaskPackage, TaskPackageStatus } from '../model';
import { Can } from '~/features/ability';
import { Role, useCurrentUser } from '~/entities/users';

export type TaskPackageDataTableProps = Table.RootProps & {
    actionEndTitle?: ReactNode;
    actionEnd?: (taskPackage: TaskPackage) => ReactNode;
    actionStartTitle?: ReactNode;
    actionStart?: (taskPackage: TaskPackage) => ReactNode;
    data: TaskPackage[];
};

export function TaskPackageDataTable({
    actionStartTitle,
    actionEndTitle,
    actionEnd,
    actionStart,
    data,
    ...props
}: TaskPackageDataTableProps) {
    const { user } = useCurrentUser();
    if (!user) throw new Error('Not defined user');
    const toLocaleDate = (date: Date) => date.toLocaleDateString('ru-RU', { dateStyle: 'medium' });

    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row>
                    {!!actionStartTitle && <Table.ColumnHeaderCell>{actionStartTitle}</Table.ColumnHeaderCell>}
                    <Table.ColumnHeaderCell>Реквизиты пакета</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Отчетный период</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Количество задач</Table.ColumnHeaderCell>
                    <Can I="read" a="Organization">
                        <Table.ColumnHeaderCell>Количество исполнителей</Table.ColumnHeaderCell>
                    </Can>
                    <Table.ColumnHeaderCell>Дата создания</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Срок исполнения</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Статус</Table.ColumnHeaderCell>
                    {user.role !== Role.Assigner && <Table.ColumnHeaderCell>Сводка</Table.ColumnHeaderCell>}
                    {!!actionEndTitle && <Table.ColumnHeaderCell width="72px">{actionEndTitle}</Table.ColumnHeaderCell>}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {data.map((taskPackage) => (
                    <Table.Row align="center" key={taskPackage.id}>
                        {actionStart != null && <Table.Cell>{actionStart(taskPackage)}</Table.Cell>}
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
                        <Table.RowHeaderCell>{toLocaleDate(taskPackage.reportDeadline)}</Table.RowHeaderCell>
                        <Table.Cell>{taskPackage.tasksCount}</Table.Cell>
                        <Can I="read" a="Organization">
                            <Table.Cell>{taskPackage.organizationsCount}</Table.Cell>
                        </Can>
                        <Table.Cell>{toLocaleDate(taskPackage.createdAt)}</Table.Cell>
                        <Table.Cell>
                            {taskPackage.nearestTaskDeadline ? toLocaleDate(taskPackage.nearestTaskDeadline) : '-'}
                        </Table.Cell>
                        <Table.Cell>
                            <Badge color={taskPackage.status === TaskPackageStatus.ACTIVE ? 'jade' : 'orange'}>
                                {taskPackage.status === TaskPackageStatus.FIXED ? 'Зафиксирован' : 'Активен'}
                            </Badge>
                        </Table.Cell>

                        {user.role !== Role.Assigner && <Table.Cell>{taskPackage.completionPercentage} %</Table.Cell>}

                        {actionEnd != null && <Table.Cell>{actionEnd(taskPackage)}</Table.Cell>}
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
