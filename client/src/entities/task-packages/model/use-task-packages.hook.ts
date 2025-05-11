import { useSearchParams } from 'react-router';
import useSWR from 'swr';

import { findAllTaskPackages } from '../api';

export function useTaskPackages() {
    const [searchParams] = useSearchParams();
    const { data, mutate } = useSWR(
        ['task-packages', ...searchParams.entries()],
        () => findAllTaskPackages(searchParams),
        { suspense: true }
    );
    return { data, mutate };
}
