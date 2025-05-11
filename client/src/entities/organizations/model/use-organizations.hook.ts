import { useSearchParams } from 'react-router';
import useSWR from 'swr';

import type { OrganizationFilterCriteria } from '~/entities/organizations';
import { findAllOrganizations } from '~/entities/organizations';

export function useOrganizations() {
    const [search] = useSearchParams();

    const { data, mutate } = useSWR(
        ['organizations', ...search.entries()],
        () => findAllOrganizations(search as OrganizationFilterCriteria),
        {
            suspense: true
        }
    );
    return { data, mutate };
}
