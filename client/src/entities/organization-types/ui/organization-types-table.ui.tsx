import type { ReactNode } from 'react';
import { Flex, Table } from '@radix-ui/themes';

import type { OrganizationType } from '../model/organization-type';

export type OrganizationTypesTableProps = Table.RootProps & {
    actionEndTitle?: ReactNode;
    actionEnd?: (organizationType: OrganizationType) => ReactNode;
    actionStartTitle?: ReactNode;
    actionStart?: (organizationType: OrganizationType) => ReactNode;
    data: OrganizationType[];
};

export function OrganizationTypesTable({
    actionStartTitle,
    actionStart,
    actionEndTitle,
    actionEnd,
    data,
    ...props
}: OrganizationTypesTableProps) {
    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row>
                    {!!actionStartTitle && (
                        <Table.ColumnHeaderCell width="72px">{actionStartTitle}</Table.ColumnHeaderCell>
                    )}
                    <Table.ColumnHeaderCell>Название</Table.ColumnHeaderCell>
                    {!!actionEndTitle && <Table.ColumnHeaderCell width="72px">{actionEndTitle}</Table.ColumnHeaderCell>}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {data.map((organizationType) => (
                    <Table.Row key={organizationType.id}>
                        {!!actionStart && (
                            <Table.Cell>
                                <Flex gap="2">{actionStart(organizationType)}</Flex>
                            </Table.Cell>
                        )}
                        <Table.Cell>{organizationType.title}</Table.Cell>
                        {!!actionEnd && (
                            <Table.Cell>
                                <Flex gap="2">{actionEnd(organizationType)}</Flex>
                            </Table.Cell>
                        )}
                    </Table.Row>
                ))}
                {!data.length && (
                    <Table.Row>
                        <Table.Cell colSpan={3}>Отсутствуют записи</Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table.Root>
    );
}
