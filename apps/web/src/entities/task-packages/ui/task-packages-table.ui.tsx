import { Badge, Table } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { use } from 'react';

import { Link } from '~/shared/ui/link';

import type { TaskPackage } from '../model/task-package';
import { TaskPackageStatus } from '../model/task-package';

export type TaskPackagesTable = Table.RootProps & {
    action?: (taskPackage: TaskPackage) => ReactNode;
    data: TaskPackage[] | Promise<TaskPackage[]>;
};

export function TaskPackagesTable({ action, data, ...props }: TaskPackagesTable) {
    const packages = use(Array.isArray(data) ? Promise.resolve(data) : data);
    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Название</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Документ-основание</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Количество задач</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Статус</Table.ColumnHeaderCell>
                    {action != null && <Table.ColumnHeaderCell width="72px" />}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {packages.map((taskPack) => (
                    <Table.Row key={taskPack.id}>
                        <Table.RowHeaderCell>
                            <Link to={taskPack.id}>{taskPack.name}</Link>
                        </Table.RowHeaderCell>
                        <Table.Cell>{taskPack.baseDocument.name}</Table.Cell>
                        <Table.Cell>{taskPack.tasksNumber}</Table.Cell>
                        <Table.Cell>
                            <Badge color={taskPack.status === TaskPackageStatus.ACTIVE ? 'jade' : 'orange'}>
                                {taskPack.status === TaskPackageStatus.FIXED ? 'Зафиксирован' : 'Активен'}
                            </Badge>
                        </Table.Cell>
                        {action != null && <Table.Cell>{action(taskPack)}</Table.Cell>}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
