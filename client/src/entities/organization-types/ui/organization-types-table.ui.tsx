import { Flex, Table } from '@radix-ui/themes';
import type { ReactNode } from 'react';

import type { OrganizationType } from '../model';

export type OrganizationTypesTableProps = Table.RootProps & {
    actionEnd?: {
        title: string;
        action: (organizationType: OrganizationType) => ReactNode;
    };
    actionStart?: {
        title: string;
        action: (organizationType: OrganizationType) => ReactNode;
    };
    data: OrganizationType[];
};

export function OrganizationTypesTable({ actionEnd, actionStart, data, ...props }: OrganizationTypesTableProps) {
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
                {data.map((organizationType) => (
                    <Table.Row key={organizationType.id}>
                        {actionStart != null && (
                            <Table.Cell>
                                <Flex gap="2">{actionStart.action(organizationType)}</Flex>
                            </Table.Cell>
                        )}
                        <Table.Cell>{organizationType.name}</Table.Cell>
                        {actionEnd != null && (
                            <Table.Cell>
                                <Flex gap="2">{actionEnd.action(organizationType)}</Flex>
                            </Table.Cell>
                        )}
                        {data.length === 0 && <Table.Cell colSpan={3}>Отсутствуют записи</Table.Cell>}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
