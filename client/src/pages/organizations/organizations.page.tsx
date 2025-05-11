import { Flex } from '@radix-ui/themes';
import React, { Suspense } from 'react';
import { useSearchParams } from 'react-router';

import { PaginatedOrganizationsTable } from '~/entities/organizations';
import { CreateOrganizationButton } from '~/features/organizations/create';
import { DeleteOrganizationButton } from '~/features/organizations/delete';
import { EditOrganizationButton } from '~/features/organizations/edit';
import {
    SearchOrganizationsByArchiveStatus,
    SearchOrganizationsByName,
    SearchOrganizationsByType
} from '~/features/organizations/filter';
import { Loader } from '~/shared/ui/loader';

export function OrganizationsPage() {
    const [searchParams] = useSearchParams();

    const key = [...searchParams.values()].join();

    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Flex gap="2">
                <CreateOrganizationButton />
                <SearchOrganizationsByName />
                <SearchOrganizationsByType />
                <SearchOrganizationsByArchiveStatus />
            </Flex>

            <Suspense fallback={<Loader />} key={key}>
                <PaginatedOrganizationsTable
                    actionEnd={{
                        title: '',
                        action: (organization) => (
                            <Flex gap="2">
                                <EditOrganizationButton organization={organization} />
                                <DeleteOrganizationButton organization={organization} />
                            </Flex>
                        )
                    }}
                />
            </Suspense>
        </Flex>
    );
}
