import { Flex, Table } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { use } from 'react';

import type { TaskCategory } from '../model/task-category';

export type TaskCategoriesTableProps = Table.RootProps & {
    action?: (category: TaskCategory) => ReactNode;
    data: Promise<TaskCategory[]>;
};

export function TaskCategoriesTable({ action, data, ...props }: TaskCategoriesTableProps): ReactNode {
    const categories = use(data);
    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Название</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Цвет</Table.ColumnHeaderCell>
                    {action != null && <Table.ColumnHeaderCell width="72px" />}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {categories.map((category) => (
                    <Table.Row key={category.id}>
                        <Table.RowHeaderCell>{category.name}</Table.RowHeaderCell>
                        <Table.Cell>{category.color}</Table.Cell>
                        <Table.Cell>
                            <Flex gap="2">{action != null && action(category)}</Flex>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
