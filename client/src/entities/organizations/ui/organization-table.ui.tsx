import type { ReactNode } from 'react';
import { Badge, Table, Text } from '@radix-ui/themes';

import type { Organization } from '../model/organization';

export type OrganizationTableProps = Table.RootProps & {
    actionStartTitle?: ReactNode;
    actionStart?: (organization: Organization) => ReactNode;
    actionEndTitle?: ReactNode;
    actionEnd?: (organization: Organization) => ReactNode;
    data: Organization[];
};

export function OrganizationsTable({
    actionStartTitle,
    actionEndTitle,
    actionEnd,
    actionStart,
    data,
    ...props
}: OrganizationTableProps) {
    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row>
                    {!!actionStartTitle && (
                        <Table.ColumnHeaderCell width="72px">{actionStartTitle}</Table.ColumnHeaderCell>
                    )}
                    <Table.ColumnHeaderCell>Название</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Тип организации</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Архивирована</Table.ColumnHeaderCell>
                    {!!actionEndTitle && <Table.ColumnHeaderCell width="72px">{actionEndTitle}</Table.ColumnHeaderCell>}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((organization) => (
                    <Table.Row key={organization.id}>
                        {!!actionStart && <Table.Cell>{actionStart(organization)}</Table.Cell>}
                        <Table.Cell>{organization.name}</Table.Cell>
                        <Table.Cell>{organization.type.title}</Table.Cell>
                        <Table.Cell>
                            <Badge color={organization.isArchived ? 'orange' : 'jade'}>
                                {organization.isArchived ? 'Архивная' : 'Активная'}
                            </Badge>
                        </Table.Cell>
                        {!!actionEnd && <Table.Cell>{actionEnd(organization)}</Table.Cell>}
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
