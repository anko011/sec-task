import { Flex } from '@radix-ui/themes';
import { Suspense, useState } from 'react';

import type { OrganizationTableProps } from '~/entities/organizations';
import { OrganizationTable } from '~/entities/organizations';
import { OrganizationsRepository } from '~/entities/organizations/api/repository';
import {
    FilterOrganizationArchiveStatusSelector,
    FilterOrganizationTypeSelector
} from '~/features/organizations/filter';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { SearchField } from '~/shared/ui/search-field';

export type SearchableOrganizationTableProps = Omit<OrganizationTableProps, 'data'>;

const LIMIT = 10;

export function SearchableOrganizationTable(props: SearchableOrganizationTableProps) {
    const [typeId, setTypeId] = useState<string | undefined>();
    const [name, setName] = useState<string | undefined>();
    const [archiveStatus, setArchiveStatus] = useState<boolean | undefined>();
    const [offset, setOffset] = useState(0);

    const data = OrganizationsRepository.findAll(
        { name: name, isArchived: archiveStatus, typeId: typeId },
        { limit: LIMIT, offset: offset }
    );

    const organizations = data.then(({ items }) => items);
    const currentPage = Math.floor(offset / LIMIT) + 1;
    const totalPages = data.then(({ total }) => Math.ceil(total / LIMIT));
    return (
        <Flex direction="column" gap="2">
            <Flex gap="2">
                <SearchField
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    placeholder="Введите название организации..."
                    style={{ width: '25%' }}
                />
                <FilterOrganizationTypeSelector
                    onChange={(typeId) => {
                        setTypeId(typeId);
                    }}
                />
                <FilterOrganizationArchiveStatusSelector
                    onChange={(isArchived) => {
                        setArchiveStatus(isArchived);
                    }}
                />
            </Flex>
            <Suspense fallback={<Loader height="500px" />}>
                <OrganizationTable data={organizations} {...props} />
                <Pagination
                    currentPage={currentPage}
                    onPageChange={(page) => {
                        setOffset((page - 1) * LIMIT);
                    }}
                    totalPages={totalPages}
                />
            </Suspense>
        </Flex>
    );
}
