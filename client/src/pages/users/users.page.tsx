import { Flex } from '@radix-ui/themes';
import React, { Suspense } from 'react';
import { useSearchParams } from 'react-router';

import { PaginatedUsersWithOrganizationTable } from '~/entities/users';
import { CreateUserButton } from '~/features/users/create';
import { DeleteUserButton } from '~/features/users/delete';
import { EditUserButton } from '~/features/users/edit';
import {
    SearchUsersByEmail,
    SearchUsersByFirstName,
    SearchUsersByOrganizationName,
    SearchUsersByPatronymic,
    SearchUsersByRole,
    SearchUsersBySecondName
} from '~/features/users/filter';
import { Loader } from '~/shared/ui/loader';

export function UsersPage() {
    const [searchParams] = useSearchParams();
    const key = [...searchParams.values()].join();

    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Flex gap="2">
                <CreateUserButton />
                <SearchUsersByEmail />
                <SearchUsersByFirstName />
                <SearchUsersBySecondName />
                <SearchUsersByPatronymic />
                <SearchUsersByRole />
                <SearchUsersByOrganizationName />
            </Flex>

            <Suspense fallback={<Loader />} key={key}>
                <PaginatedUsersWithOrganizationTable
                    actionEnd={{
                        title: '',
                        action: (user) => (
                            <Flex gap="2">
                                <EditUserButton user={user} />
                                <DeleteUserButton user={user} />
                            </Flex>
                        )
                    }}
                />
            </Suspense>
        </Flex>
    );
}
