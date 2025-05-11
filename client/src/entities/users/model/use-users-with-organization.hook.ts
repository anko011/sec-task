import { useSearchParams } from 'react-router';
import useSWR from 'swr';

import { findAllUsersWithOrganization } from '../api';

export function useUsersWithOrganization() {
    const [searchParams] = useSearchParams();
    const { data, mutate } = useSWR(
        ['users-with-organization', ...searchParams.entries()],
        () => findAllUsersWithOrganization(searchParams),
        { suspense: true }
    );
    return { data, mutate };
}
