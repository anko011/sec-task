import type { ReactNode } from 'react';
import { Table, Text } from '@radix-ui/themes';

import type { TaskCategory } from '../model/task-category';
import { ColorView } from '~/shared/ui/color-picker';

export type TaskCategoriesTableProps = Table.RootProps & {
    actionEndTitle?: ReactNode;
    actionEnd?: (category: TaskCategory) => ReactNode;
    actionStartTitle?: ReactNode;
    actionStart?: (category: TaskCategory) => ReactNode;
    data: TaskCategory[];
};

export function TaskCategoriesTable({
    actionStartTitle,
    actionStart,
    actionEndTitle,
    actionEnd,
    data,
    ...props
}: TaskCategoriesTableProps): ReactNode {
    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row>
                    {!!actionStartTitle && (
                        <Table.ColumnHeaderCell width="72px">{actionStartTitle}</Table.ColumnHeaderCell>
                    )}
                    <Table.ColumnHeaderCell>Название</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Цвет</Table.ColumnHeaderCell>
                    {!!actionEndTitle && <Table.ColumnHeaderCell width="72px">{actionEndTitle}</Table.ColumnHeaderCell>}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {data.map((category) => (
                    <Table.Row key={category.id}>
                        {!!actionStart && <Table.Cell>{actionStart(category)}</Table.Cell>}
                        <Table.RowHeaderCell>{category.title}</Table.RowHeaderCell>
                        <Table.Cell>
                            <ColorView color={category.color} />
                        </Table.Cell>
                        {!!actionEnd && <Table.Cell>{actionEnd(category)}</Table.Cell>}
                    </Table.Row>
                ))}
                {!data.length && (
                    <Table.Row>
                        <Table.Cell colSpan={4}>
                            <Text>Отсутствуют элементы</Text>
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table.Root>
    );
}
