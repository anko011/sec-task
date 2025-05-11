import { Flex } from '@radix-ui/themes';
import React, { Suspense } from 'react';
import { useSearchParams } from 'react-router';

import { PaginatedOrganizationTypesTable } from '~/entities/organization-types';
import { CreateOrganizationTypeButton } from '~/features/organization-types/create';
import { DeleteOrganizationTypeButton } from '~/features/organization-types/delete';
import { EditOrganizationTypeButton } from '~/features/organization-types/edit';
import { SearchOrganizationTypesByName } from '~/features/organization-types/filter';
import { Loader } from '~/shared/ui/loader';

export function OrganizationTypesPage() {
    const [searchParams] = useSearchParams([
        ['limit', '10'],
        ['offset', '0']
    ]);
    const key = [...searchParams.values()].join();

    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Flex gap="2">
                <CreateOrganizationTypeButton />
                <SearchOrganizationTypesByName />
            </Flex>

            <Suspense fallback={<Loader />} key={key}>
                <PaginatedOrganizationTypesTable
                    actionEnd={{
                        title: '',
                        action: (type) => (
                            <Flex gap="2">
                                <EditOrganizationTypeButton organizationType={type} />
                                <DeleteOrganizationTypeButton organizationType={type} />
                            </Flex>
                        )
                    }}
                />
            </Suspense>
        </Flex>
    );
}
