import { Flex, Table } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { use } from 'react';

import type { OrganizationType } from '../model';

export type OrganizationTypesTableProps = Table.RootProps & {
    actions?: (organizationType: OrganizationType) => ReactNode;
    data: Promise<OrganizationType[]> | OrganizationType[];
};

export function OrganizationTypesTable({ actions, data, ...props }: OrganizationTypesTableProps) {
    const organizationTypes = use(Array.isArray(data) ? Promise.resolve(data) : data);
    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Название</Table.ColumnHeaderCell>
                    {actions != null && <Table.ColumnHeaderCell width="72px" />}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {organizationTypes.map((organizationType) => (
                    <Table.Row key={organizationType.id}>
                        <Table.RowHeaderCell>{organizationType.name}</Table.RowHeaderCell>
                        {actions != null && (
                            <Table.Cell>
                                <Flex gap="2">{actions(organizationType)}</Flex>
                            </Table.Cell>
                        )}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
