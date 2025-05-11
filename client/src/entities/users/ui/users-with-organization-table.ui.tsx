import { Table, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';

import type { UserWithOrganization } from '../model';
import { UserRoleBadge } from './user-role-badge.ui';

export type UsersWithOrganizationTableProps = Table.RootProps & {
    actionEnd?: {
        title: string;
        action: (user: UserWithOrganization) => ReactNode;
    };
    actionStart?: {
        title: string;
        action: (user: UserWithOrganization) => ReactNode;
    };
    data: UserWithOrganization[];
};

export function UsersWithOrganizationTable({
    actionEnd,
    actionStart,
    data,
    ...props
}: UsersWithOrganizationTableProps) {
    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row>
                    {actionStart != null && <Table.ColumnHeaderCell>{actionStart.title}</Table.ColumnHeaderCell>}
                    <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Имя</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Фамилия</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Отчество</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Роль</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Организация</Table.ColumnHeaderCell>
                    {actionEnd != null && (
                        <Table.ColumnHeaderCell width="72px">{actionEnd.title}</Table.ColumnHeaderCell>
                    )}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {data.map((user) => (
                    <Table.Row align="center" key={user.id}>
                        {actionStart != null && <Table.Cell>{actionStart.action(user)}</Table.Cell>}
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>{user.firstName}</Table.Cell>
                        <Table.Cell>{user.secondName}</Table.Cell>
                        <Table.Cell>{user.patronymic}</Table.Cell>
                        <Table.Cell>
                            <UserRoleBadge role={user.role} />
                        </Table.Cell>
                        <Table.Cell>{user.organization.name}</Table.Cell>
                        {actionEnd != null && <Table.Cell>{actionEnd.action(user)}</Table.Cell>}
                    </Table.Row>
                ))}
                {data.length === 0 && (
                    <Table.Row>
                        <Table.Cell colSpan={8}>
                            <Text>Записи отсутствуют...</Text>
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table.Root>
    );
}
