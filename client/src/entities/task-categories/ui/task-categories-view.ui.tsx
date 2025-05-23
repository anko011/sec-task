import { createContext, type Dispatch, type ReactNode, type SetStateAction, useRef, useState } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { useDebouncedCallback } from 'use-debounce';

import type { PaginateOptions } from '~/shared/api';
import { useStrictContext } from '~/shared/lib';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { MaskedFilterField } from '~/shared/ui/masked-filter-field';

import { type TaskCategoriesFilters, useTaskCategories } from '../model/use-task-categories';
import { TaskCategoriesTable, type TaskCategoriesTableProps } from './task-categories-table.ui';
import { ColorPicker } from '~/shared/ui/color-picker';

export const TaskCategoriesViewContext = createContext<
    | (ReturnType<typeof useTaskCategories> & {
          pagination: PaginateOptions;
          setPagination: Dispatch<SetStateAction<PaginateOptions>>;
          filters: TaskCategoriesFilters;
          setFilters: Dispatch<SetStateAction<TaskCategoriesFilters>>;
      })
    | null
>(null);

function Root({ children }: { children?: ReactNode }) {
    const [pagination, setPagination] = useState<PaginateOptions>({ limit: 10, offset: 0 });
    const [filters, setFilters] = useState<TaskCategoriesFilters>({});
    const taskCategoriesController = useTaskCategories(filters, pagination);
    return (
        <TaskCategoriesViewContext.Provider
            value={{
                ...taskCategoriesController,
                filters,
                setFilters,
                pagination,
                setPagination
            }}
        >
            {children}
        </TaskCategoriesViewContext.Provider>
    );
}

function DataTable(props: Omit<TaskCategoriesTableProps, 'data'>) {
    const { data, isLoading, setPagination } = useStrictContext(TaskCategoriesViewContext);
    if (isLoading) return <Loader />;
    if (!data) return null;

    return (
        <Flex direction="column" gap="2">
            <TaskCategoriesTable data={data.items} {...props} />
            <Pagination data={data} onChange={setPagination} />
        </Flex>
    );
}

function TitleFilter() {
    const { setFilters, filters } = useStrictContext(TaskCategoriesViewContext);
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

function ColorFilter() {
    const { setFilters, filters } = useStrictContext(TaskCategoriesViewContext);

    const onChange = (value: string) => {
        setFilters((prev) => ({ ...prev, color: value === '-1' ? undefined : value }));
    };
    return (
        <Flex asChild align="center" gap="2">
            <label>
                <Text size="2" wrap="nowrap">
                    Цвет
                </Text>
                <ColorPicker color={filters.color} onChange={onChange} />
            </label>
        </Flex>
    );
}

export const TaskCategoriesView = { Root, DataTable, TitleFilter, ColorFilter };
