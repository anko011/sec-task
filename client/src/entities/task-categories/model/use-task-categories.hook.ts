import { useSearchParams } from 'react-router';
import useSWR from 'swr';

import { findAllTaskCategories } from '../api';

export function useTaskCategories() {
    const [searchParams] = useSearchParams();
    const { data, mutate } = useSWR(
        ['task-categories', ...searchParams.entries()],
        () => findAllTaskCategories(searchParams),
        { suspense: true }
    );
    return { data, mutate };
}
