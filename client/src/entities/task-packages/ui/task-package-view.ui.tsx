import { createContext, type Dispatch, type ReactNode, type SetStateAction, useCallback, useState } from 'react';
import { Flex, Select, Text } from '@radix-ui/themes';
import { useDebouncedCallback } from 'use-debounce';

import type { PaginateOptions } from '~/shared/api';
import { useStrictContext } from '~/shared/lib';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { MaskedFilterField } from '~/shared/ui/masked-filter-field';

import { type TaskPackageFilters, useTaskPackages } from '../model/use-task-packages';
import { useRequisiteMask } from '../lib/use-requsite-mask';
import { TaskPackageStatus } from '../model/task-package-status';

import { TaskPackageDataTable, type TaskPackageDataTableProps } from './task-package-table.ui';

type TaskPackageViewContextValue = ReturnType<typeof useTaskPackages> & {
    filters: TaskPackageFilters;
    setFilters: Dispatch<SetStateAction<TaskPackageFilters>>;
    pagination: PaginateOptions;
    setPagination: Dispatch<SetStateAction<PaginateOptions>>;
};

export const TaskPackageViewContext = createContext<TaskPackageViewContextValue | null>(null);

function Root({ children }: { children?: ReactNode }) {
    const [filters, setFilters] = useState<TaskPackageFilters>({});
    const [pagination, setPagination] = useState<PaginateOptions>({ limit: 10, offset: 0 });
    const value = useTaskPackages(filters, pagination);

    return (
        <TaskPackageViewContext.Provider value={{ ...value, filters, setFilters, pagination, setPagination }}>
            {children}
        </TaskPackageViewContext.Provider>
    );
}

function DataTable(props: Omit<TaskPackageDataTableProps, 'data'>) {
    const { data, isLoading, setPagination } = useStrictContext(TaskPackageViewContext);
    if (!data || isLoading) return <Loader height="100%" />;
    return (
        <Flex direction="column" gap="2">
            <TaskPackageDataTable data={data.items} {...props} />
            <Pagination data={data} onChange={setPagination} />
        </Flex>
    );
}

function IncomingRequisiteFilter() {
    const { setFilters, filters } = useStrictContext(TaskPackageViewContext);

    const debounced = useDebouncedCallback((value: string) => {
        setFilters((prev) => ({ ...prev, incomingRequisite: value }));
    }, 300);

    const { ref, setValue } = useRequisiteMask({ onAccept: debounced });

    const handleClear = () => {
        setValue('');
        setFilters((prev) => ({ ...prev, incomingRequisite: '' }));
    };

    return (
        <MaskedFilterField
            label="Входящий реквизит"
            placeholder="Введите входящий реквизит..."
            defaultValue={filters.incomingRequisite ?? ''}
            onChange={debounced}
            ref={ref}
            onClear={handleClear}
        />
    );
}

function OutgoingRequisiteFilter() {
    const { setFilters, filters } = useStrictContext(TaskPackageViewContext);

    const debounced = useDebouncedCallback((value: string) => {
        setFilters((prev) => ({ ...prev, outgoingRequisite: value }));
    }, 300);

    const { ref, setValue } = useRequisiteMask({ onAccept: debounced });

    const handleClear = () => {
        setValue('');
        setFilters((prev) => ({ ...prev, outgoingRequisite: '' }));
    };

    return (
        <MaskedFilterField
            label="Исходящий реквизит"
            placeholder="Введите исходящий реквизит..."
            defaultValue={filters.outgoingRequisite ?? ''}
            onChange={debounced}
            ref={ref}
            onClear={handleClear}
        />
    );
}

function StatusFilter() {
    const { setFilters, filters } = useStrictContext(TaskPackageViewContext);

    const handleChange = useCallback(
        (value: string) => {
            setFilters({
                ...filters,
                status: value === '-1' ? undefined : (value as TaskPackageStatus)
            });
        },
        [filters, setFilters]
    );

    return (
        <Flex asChild align="center" gap="2">
            <label>
                <Text size="2" wrap="nowrap">
                    Статус
                </Text>
                <Select.Root defaultValue={filters.status ?? '-1'} onValueChange={handleChange}>
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Item value="-1">Не выбрано</Select.Item>
                        <Select.Item value={TaskPackageStatus.FIXED}>Зафиксирован</Select.Item>
                        <Select.Item value={TaskPackageStatus.ACTIVE}>Активен</Select.Item>
                    </Select.Content>
                </Select.Root>
            </label>
        </Flex>
    );
}

export const TaskPackageView = {
    Root,
    DataTable,
    IncomingRequisiteFilter,
    OutgoingRequisiteFilter,
    StatusFilter
};
