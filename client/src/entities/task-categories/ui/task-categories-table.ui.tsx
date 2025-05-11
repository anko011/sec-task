import { Table } from '@radix-ui/themes';
import type { ReactNode } from 'react';

import type { TaskCategory } from '../model/task-category';

export type TaskCategoriesTableProps = Table.RootProps & {
    actionEnd?: {
        title: string;
        action: (category: TaskCategory) => ReactNode;
    };
    actionStart?: {
        title: string;
        action: (category: TaskCategory) => ReactNode;
    };
    data: TaskCategory[];
};

export function TaskCategoriesTable({ actionEnd, actionStart, data, ...props }: TaskCategoriesTableProps): ReactNode {
    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row>
                    {actionStart != null && (
                        <Table.ColumnHeaderCell width="72px">{actionStart.title}</Table.ColumnHeaderCell>
                    )}
                    <Table.ColumnHeaderCell>Название</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Цвет</Table.ColumnHeaderCell>
                    {actionEnd != null && (
                        <Table.ColumnHeaderCell width="72px">{actionEnd.title}</Table.ColumnHeaderCell>
                    )}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {data.map((category) => (
                    <Table.Row key={category.id}>
                        {actionStart != null && <Table.Cell>{actionStart.action(category)}</Table.Cell>}
                        <Table.RowHeaderCell>{category.name}</Table.RowHeaderCell>
                        <Table.Cell>{category.color}</Table.Cell>
                        {actionEnd != null && <Table.Cell>{actionEnd.action(category)}</Table.Cell>}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
