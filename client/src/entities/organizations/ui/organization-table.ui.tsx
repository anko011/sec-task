import { Badge, Table, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';

import type { Organization } from '../model';

export type OrganizationTableProps = Table.RootProps & {
    actionEnd?: {
        title: string;
        action: (organization: Organization) => ReactNode;
    };
    actionStart?: {
        title: ReactNode;
        action: (organization: Organization) => ReactNode;
    };
    data: Organization[];
};

export function OrganizationsTable({ actionEnd, actionStart, data, ...props }: OrganizationTableProps) {
    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row>
                    {actionStart != null && (
                        <Table.ColumnHeaderCell width="72px">{actionStart.title}</Table.ColumnHeaderCell>
                    )}
                    <Table.ColumnHeaderCell>Название</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Тип организации</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Архивирована</Table.ColumnHeaderCell>
                    {actionEnd != null && (
                        <Table.ColumnHeaderCell width="72px">{actionEnd.title}</Table.ColumnHeaderCell>
                    )}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((organization) => (
                    <Table.Row key={organization.id}>
                        {actionStart != null && <Table.Cell>{actionStart.action(organization)}</Table.Cell>}
                        <Table.Cell>{organization.name}</Table.Cell>
                        <Table.Cell>{organization.type.name}</Table.Cell>
                        <Table.Cell>
                            <Badge color={organization.isArchived ? 'orange' : 'jade'}>
                                {organization.isArchived ? 'Архивная' : 'Активная'}
                            </Badge>
                        </Table.Cell>
                        {actionEnd != null && <Table.Cell>{actionEnd.action(organization)}</Table.Cell>}
                    </Table.Row>
                ))}
                {data.length === 0 && (
                    <Table.Row>
                        <Table.Cell colSpan={5}>
                            <Text>Отсутствуют элементы</Text>
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table.Root>
    );
}
