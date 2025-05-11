import { useSearchParams } from 'react-router';
import useSWR from 'swr';

import { findAllOrganizationTypes } from '../api';

export function useOrganizationTypes() {
    const [searchParams] = useSearchParams();
    const { data, mutate } = useSWR(
        ['organization-types', ...searchParams.entries()],
        () => findAllOrganizationTypes(searchParams),
        {
            suspense: true
        }
    );
    return { data, mutate };
}
