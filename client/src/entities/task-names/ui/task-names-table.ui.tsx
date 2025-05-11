import { Table, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';

import type { TaskName } from '../model';

export type TaskNamesTableProps = Table.RootProps & {
    actionEnd?: {
        title: string;
        action: (name: TaskName) => ReactNode;
    };
    actionStart?: {
        title: string;
        action: (name: TaskName) => ReactNode;
    };
    data: TaskName[];
};

export function TaskNamesTable({ actionEnd, actionStart, data, ...props }: TaskNamesTableProps) {
    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row>
                    {actionStart != null && (
                        <Table.ColumnHeaderCell width="72px">{actionStart.title}</Table.ColumnHeaderCell>
                    )}
                    <Table.ColumnHeaderCell>Название</Table.ColumnHeaderCell>
                    {actionEnd != null && (
                        <Table.ColumnHeaderCell width="72px">{actionEnd.title}</Table.ColumnHeaderCell>
                    )}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((taskName) => (
                    <Table.Row key={taskName.id}>
                        {actionStart != null && <Table.Cell>{actionStart.action(taskName)}</Table.Cell>}
                        <Table.Cell>{taskName.name}</Table.Cell>
                        {actionEnd != null && <Table.Cell>{actionEnd.action(taskName)}</Table.Cell>}
                    </Table.Row>
                ))}
                {data.length === 0 && (
                    <Table.Row>
                        <Table.Cell colSpan={3}>
                            <Text>Отсутствуют элементы</Text>
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table.Root>
    );
}
