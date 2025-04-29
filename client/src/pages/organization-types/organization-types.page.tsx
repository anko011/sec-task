import { Flex } from '@radix-ui/themes';
import { Suspense } from 'react';

import { OrganizationTypesRepository } from '~/entities/organization-types';
import { OrganizationTypesTable } from '~/entities/organization-types/';
import { CreateOrganizationTypeButton } from '~/features/organization-types/create';
import { DeleteOrganizationTypeButton } from '~/features/organization-types/delete';
import { EditOrganizationTypeButton } from '~/features/organization-types/edit';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { SearchField } from '~/shared/ui/search-field';

const organizationTypes = OrganizationTypesRepository.findAll();

export function OrganizationTypesPage() {
    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Suspense fallback={<Loader />}>
                <Flex align="center" gap="2">
                    <CreateOrganizationTypeButton />
                    <SearchField placeholder="Название типа..." />
                </Flex>
                <OrganizationTypesTable
                    actions={(organizationType) => (
                        <>
                            <EditOrganizationTypeButton organizationType={organizationType} />
                            <DeleteOrganizationTypeButton organizationType={organizationType} />
                        </>
                    )}
                    data={organizationTypes}
                />
                <Pagination currentPage={5} totalPages={10} />
            </Suspense>
        </Flex>
    );
}
