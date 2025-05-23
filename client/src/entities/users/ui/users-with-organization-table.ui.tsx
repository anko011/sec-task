import { Table, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';

import type { User, UserWithOrganization } from '../model';
import { UserRoleBadge } from './user-role-badge.ui';

export type UsersWithOrganizationTableProps = Table.RootProps & {
    actionEndTitle?: ReactNode;
    actionEnd?: (user: UserWithOrganization | User) => ReactNode;
    actionStartTitle?: ReactNode;
    actionStart?: (user: UserWithOrganization) => ReactNode;
    data: UserWithOrganization[];
};

export function UsersWithOrganizationTable({
    actionStartTitle,
    actionStart,
    actionEndTitle,
    actionEnd,
    data,
    ...props
}: UsersWithOrganizationTableProps) {
    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row>
                    {!!actionStartTitle && <Table.ColumnHeaderCell>{actionStartTitle}</Table.ColumnHeaderCell>}
                    <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Имя</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Фамилия</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Отчество</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Роль</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Организация</Table.ColumnHeaderCell>
                    {!!actionEndTitle && <Table.ColumnHeaderCell width="72px">{actionEndTitle}</Table.ColumnHeaderCell>}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {data.map((user) => (
                    <Table.Row align="center" key={user.id}>
                        {!!actionStart && <Table.Cell>{actionStart(user)}</Table.Cell>}
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>{user.firstName}</Table.Cell>
                        <Table.Cell>{user.secondName}</Table.Cell>
                        <Table.Cell>{user.patronymic}</Table.Cell>
                        <Table.Cell>
                            <UserRoleBadge role={user.role} />
                        </Table.Cell>
                        <Table.Cell>{user.organization?.name ?? ' - '}</Table.Cell>
                        {!!actionEnd && <Table.Cell>{actionEnd(user)}</Table.Cell>}
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
