import { Flex } from '@radix-ui/themes';
import { Suspense } from 'react';

import { OrganizationTable } from '~/entities/organizations';
import { OrganizationsRepository } from '~/entities/organizations/api/repository';
import { CreateOrganizationButton } from '~/features/organizations/create/';
import { DeleteOrganizationButton } from '~/features/organizations/delete';
import { EditOrganizationButton } from '~/features/organizations/edit';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { SearchField } from '~/shared/ui/search-field';

const organizations = OrganizationsRepository.findAll();

export function OrganizationsPage() {
    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Suspense fallback={<Loader />}>
                <Flex gap="2">
                    <CreateOrganizationButton />
                    <SearchField placeholder="Название организации..." />
                </Flex>

                <OrganizationTable
                    actionEnd={{
                        title: '',
                        action: (organization) => (
                            <Flex gap="2">
                                <EditOrganizationButton organization={organization} />
                                <DeleteOrganizationButton organization={organization} />
                            </Flex>
                        )
                    }}
                    data={organizations.then(({ items }) => items)}
                />
                <Pagination currentPage={5} totalPages={10} />
            </Suspense>
        </Flex>
    );
}
