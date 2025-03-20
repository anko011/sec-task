import { Checkbox, Table } from '@radix-ui/themes';
import { use } from 'react';

import type { Assignee } from '../model/assignee';

export type AssigneesTableProps = {
    data: Promise<Assignee[]>;
    defaultValue?: Assignee[] | null;
    onSelectAssignees?: (assignees: Assignee[]) => void;
};

export function AssigneesTable({ data, defaultValue }: AssigneesTableProps) {
    const assignees = use(data);
    const defaultIds = defaultValue?.map(({ id }) => id);
    return (
        <>
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell width="64px" />
                        <Table.ColumnHeaderCell>Имя</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Фамилия</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Организация</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {assignees.map((assignee) => (
                        <Table.Row key={assignee.id}>
                            <Table.RowHeaderCell>
                                <Checkbox
                                    defaultChecked={defaultIds?.includes(assignee.id)}
                                    name="assignee"
                                    value={assignee.id}
                                />
                            </Table.RowHeaderCell>
                            <Table.Cell>{assignee.firstName}</Table.Cell>
                            <Table.Cell>{assignee.secondName}</Table.Cell>
                            <Table.Cell>{assignee.organization.name}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </>
    );
}
