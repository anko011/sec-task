import { Badge, Table } from '@radix-ui/themes';
import type { JSX, ReactNode } from 'react';
import { use } from 'react';

import type { Task } from '../model/task';
import { TaskStatus } from '../model/task';

export type TaskProgressTableProps = Table.RootProps & {
    data: Task | Promise<Task>;
};

const taskStatusBadges: Record<TaskStatus, ReactNode> = {
    [TaskStatus.COMPENSATED]: <Badge color="yellow">Приняты компенсирующие меры</Badge>,
    [TaskStatus.COMPLETED]: <Badge color="jade">Выполнено</Badge>,
    [TaskStatus.IN_PROGRESS]: <Badge>В работе</Badge>,
    [TaskStatus.NEW]: <Badge>Новый</Badge>,
    [TaskStatus.NO_ACTUAL]: <Badge color="orange">Не актуально</Badge>
};

export function TaskProgressTable({ data, ...props }: TaskProgressTableProps): JSX.Element {
    const task = use(Promise.resolve(data));
    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Имя</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Фамилия</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Организация</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Статус</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {task.assigneeProgresses.map((progress) => (
                    <Table.Row key={progress.assignee.id}>
                        <Table.RowHeaderCell>{progress.assignee.firstName}</Table.RowHeaderCell>
                        <Table.Cell>{progress.assignee.secondName}</Table.Cell>
                        <Table.Cell>{progress.assignee.organization.name}</Table.Cell>
                        <Table.Cell>{taskStatusBadges[progress.status]}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
