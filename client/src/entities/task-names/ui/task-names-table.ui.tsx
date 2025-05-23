import type { ReactNode } from 'react';
import { Table, Text } from '@radix-ui/themes';

import type { TaskName } from '../model/task-name';

export type TaskNamesTableProps = Table.RootProps & {
    actionEndTitle?: ReactNode;
    actionEnd?: (name: TaskName) => ReactNode;
    actionStartTitle?: ReactNode;
    actionStart?: (name: TaskName) => ReactNode;
    data: TaskName[];
};

export function TaskNamesTable({
    actionStartTitle,
    actionStart,
    actionEndTitle,
    actionEnd,
    data,
    ...props
}: TaskNamesTableProps) {
    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row>
                    {!!actionStart && <Table.ColumnHeaderCell width="72px">{actionStartTitle}</Table.ColumnHeaderCell>}
                    <Table.ColumnHeaderCell>Название</Table.ColumnHeaderCell>
                    {!!actionEnd && <Table.ColumnHeaderCell width="72px">{actionEndTitle}</Table.ColumnHeaderCell>}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((taskName) => (
                    <Table.Row key={taskName.id}>
                        {!!actionStart && <Table.Cell>{actionStart(taskName)}</Table.Cell>}
                        <Table.Cell>{taskName.title}</Table.Cell>
                        {!!actionEnd && <Table.Cell>{actionEnd(taskName)}</Table.Cell>}
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
