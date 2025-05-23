import { createContext, type Dispatch, type ReactNode, type SetStateAction, useRef, useState } from 'react';
import { Flex } from '@radix-ui/themes';
import { useDebouncedCallback } from 'use-debounce';

import type { PaginateOptions } from '~/shared/api';
import { useStrictContext } from '~/shared/lib';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { MaskedFilterField } from '~/shared/ui/masked-filter-field';

import { type TaskNamesFilters, useTaskNames } from '../model/use-task-names';

import { TaskNamesTable, type TaskNamesTableProps } from './task-names-table.ui';

export const TaskNamesViewContext = createContext<
    | (ReturnType<typeof useTaskNames> & {
          pagination: PaginateOptions;
          setPagination: Dispatch<SetStateAction<PaginateOptions>>;
          filters: TaskNamesFilters;
          setFilters: Dispatch<SetStateAction<TaskNamesFilters>>;
      })
    | null
>(null);

function Root({ children }: { children?: ReactNode }) {
    const [pagination, setPagination] = useState<PaginateOptions>({ limit: 10, offset: 0 });
    const [filters, setFilters] = useState<TaskNamesFilters>({});
    const taskNamesController = useTaskNames(filters, pagination);
    return (
        <TaskNamesViewContext.Provider
            value={{
                ...taskNamesController,
                filters,
                setFilters,
                pagination,
                setPagination
            }}
        >
            {children}
        </TaskNamesViewContext.Provider>
    );
}

function DataTable(props: Omit<TaskNamesTableProps, 'data'>) {
    const { data, isLoading, setPagination } = useStrictContext(TaskNamesViewContext);
    if (isLoading) return <Loader />;
    if (!data) return null;

    return (
        <Flex direction="column" gap="2">
            <TaskNamesTable data={data.items} {...props} />
            <Pagination data={data} onChange={setPagination} />
        </Flex>
    );
}

function TitleFilter() {
    const { setFilters, filters } = useStrictContext(TaskNamesViewContext);
    const ref = useRef<HTMLInputElement>(null);

    const debounced = useDebouncedCallback((value: string) => {
        setFilters({ title: value });
    }, 300);

    const handleClear = () => {
        if (ref.current) ref.current.value = '';
        setFilters({ title: '' });
    };

    return (
        <MaskedFilterField
            ref={ref}
            label="Наименование"
            defaultValue={filters.title}
            placeholder="Введите наименование..."
            onChange={debounced}
            onClear={handleClear}
        />
    );
}

export const TaskNamesView = { Root, DataTable, TitleFilter };
