import { Badge, Flex, Table } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { use } from 'react';

import type { Organization } from '../model/organization';

export type OrganizationTableProps = Table.RootProps & {
    action?: (organization: Organization) => ReactNode;
    data: Organization[] | Promise<Organization[]>;
};

export function OrganizationTable({ action, data, ...props }: OrganizationTableProps) {
    const organizations = use(Promise.resolve(data));
    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Название</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Тип организации</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Архивирована</Table.ColumnHeaderCell>
                    {action != null && <Table.ColumnHeaderCell width="72px" />}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {organizations.map((organization) => (
                    <Table.Row key={organization.id}>
                        <Table.RowHeaderCell>{organization.name}</Table.RowHeaderCell>
                        <Table.Cell>{organization.type.name}</Table.Cell>
                        <Table.Cell>
                            <Badge color={organization.isArchived ? 'orange' : 'jade'}>
                                {organization.isArchived ? 'Архивная' : 'Активная'}
                            </Badge>
                        </Table.Cell>
                        <Table.Cell>
                            <Flex gap="2">{action != null && action(organization)}</Flex>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
