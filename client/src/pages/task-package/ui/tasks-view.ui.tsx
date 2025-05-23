import { createContext, type Dispatch, type ReactNode, type SetStateAction, useState } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { useDebouncedCallback } from 'use-debounce';
import {
    type Task,
    type TaskDangerStatus,
    TaskDangerStatusSelector,
    type TaskFilters,
    useNumberMask,
    useTasks
} from '~/entities/tasks';
import { type TaskName, TaskNamesSelector } from '~/entities/task-names';
import { TaskCategoriesSelector, type TaskCategory } from '~/entities/task-categories';

import type { PaginateOptions } from '~/shared/api';
import { useStrictContext } from '~/shared/lib';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { MaskedFilterField } from '~/shared/ui/masked-filter-field';

import { AssignerTasksList, type TaskListProps, TasksList } from './task-list.ui';

export const TasksViewContext = createContext<
    | (ReturnType<typeof useTasks> & {
          pagination: PaginateOptions;
          setPagination: Dispatch<SetStateAction<PaginateOptions>>;
          filters: TaskFilters;
          setFilters: Dispatch<SetStateAction<TaskFilters>>;
      })
    | null
>(null);

function Root({ taskPackageId, children }: { taskPackageId: string; children?: ReactNode }) {
    const [pagination, setPagination] = useState<PaginateOptions>({ limit: 10, offset: 0 });
    const [filters, setFilters] = useState<TaskFilters>({});
    const tasks = useTasks(taskPackageId, filters, pagination);
    return (
        <TasksViewContext.Provider
            value={{
                ...tasks,
                filters,
                setFilters,
                pagination,
                setPagination
            }}
        >
            {children}
        </TasksViewContext.Provider>
    );
}

function DataList(props: Omit<TaskListProps, 'data'> & { dialogContent: (task: Task) => ReactNode }) {
    const { data, isLoading, setPagination } = useStrictContext(TasksViewContext);
    if (isLoading) return <Loader />;
    if (!data) return null;

    return (
        <Flex direction="column" gap="2" width="100%">
            <TasksList data={data.items} {...props} />
            <Pagination data={data} onChange={setPagination} />
        </Flex>
    );
}

function AssignerDataList(props: Omit<TaskListProps, 'data'> & { dialogContent: (task: Task) => ReactNode }) {
    const { data, isLoading, setPagination } = useStrictContext(TasksViewContext);
    if (isLoading) return <Loader />;
    if (!data) return null;

    return (
        <Flex direction="column" gap="2" width="100%">
            <AssignerTasksList data={data.items} {...props} />
            <Pagination data={data} onChange={setPagination} />
        </Flex>
    );
}

function NumberFilter() {
    const { setFilters, filters } = useStrictContext(TasksViewContext);

    const debounced = useDebouncedCallback((value: string) => {
        setFilters((prev) => ({ ...prev, number: value }));
    }, 300);

    const { ref, setValue } = useNumberMask({ onAccept: debounced });

    const handleClear = () => {
        setValue('');
        setFilters((prev) => ({ ...prev, number: '' }));
    };

    return (
        <MaskedFilterField
            label="Номер"
            placeholder="Введите номер..."
            defaultValue={filters.number ?? ''}
            onChange={debounced}
            ref={ref}
            onClear={handleClear}
        />
    );
}

function NameFilter() {
    const { setFilters, filters } = useStrictContext(TasksViewContext);

    const onChange = (type?: TaskName) => {
        setFilters((prev) => ({ ...prev, nameId: type?.id }));
    };
    return (
        <Flex asChild align="center" gap="2">
            <label>
                <Text size="2" wrap="nowrap">
                    Название задачи
                </Text>
                <TaskNamesSelector defaultValue={filters.nameId} onChange={onChange} />
            </label>
        </Flex>
    );
}

function CategoryFilter() {
    const { setFilters, filters } = useStrictContext(TasksViewContext);

    const onChange = (type?: TaskCategory) => {
        setFilters((prev) => ({ ...prev, categoryId: type?.id }));
    };

    return (
        <Flex asChild align="center" gap="2">
            <label>
                <Text size="2" wrap="nowrap">
                    Категория задачи
                </Text>
                <TaskCategoriesSelector defaultValue={filters.categoryId} onChange={onChange} />
            </label>
        </Flex>
    );
}

function DangerStatusFilter() {
    const { setFilters } = useStrictContext(TasksViewContext);

    const onChange = (value?: TaskDangerStatus) => {
        setFilters((prev) => ({ ...prev, dangerStatus: value }));
    };
    return (
        <Flex asChild align="center" gap="2">
            <label>
                <Text size="2" wrap="nowrap">
                    Уровень критичности
                </Text>
                <TaskDangerStatusSelector onValueChange={onChange} />
            </label>
        </Flex>
    );
}

export const TasksView = {
    Root,
    DataList,
    AssignerDataList,
    NameFilter,
    DangerStatusFilter,
    CategoryFilter,
    NumberFilter
};
