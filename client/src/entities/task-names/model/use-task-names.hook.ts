import { useSearchParams } from 'react-router';
import useSWR from 'swr';

import { findAllTaskNames } from '../api';

export function useTaskNames() {
    const [searchParams] = useSearchParams();
    const { data, mutate } = useSWR(['task-names', ...searchParams.entries()], () => findAllTaskNames(searchParams), {
        suspense: true
    });
    return { data, mutate };
}
