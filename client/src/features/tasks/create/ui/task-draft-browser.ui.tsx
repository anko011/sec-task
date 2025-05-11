import { Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';
import { Box, Flex, ScrollArea, Strong, Text, TextField } from '@radix-ui/themes';
import type { ChangeEventHandler, Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';

import type { TaskName } from '~/entities/task-names';
import { TaskNamesSelector } from '~/entities/task-names';
import type { Task, TaskDTO } from '~/entities/tasks';
import { TaskForm, TasksList } from '~/entities/tasks';
import { findAllTasks } from '~/entities/tasks/api/repository';
import type { PaginateOptions } from '~/shared/api';
import { DeleteEntityDialog } from '~/shared/ui/delete-entity-dialog/index';
import { Pagination } from '~/shared/ui/pagination';
import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';

import type { TaskDraft } from '../model';
import type { TaskDraftFilterCriteria } from '../model/task-draft';
import { TaskDraftList } from './task-draft-list.ui';

type TaskDraftBrowserState = {
    data?: TaskDraft[];
    deletedTaskIds?: string[];
    filters: TaskDraftFilterCriteria;
    setData?: Dispatch<SetStateAction<TaskDraft[]>>;
    setDeletedTaskIds?: Dispatch<SetStateAction<string[]>>;
    setFilters: Dispatch<SetStateAction<TaskDraftFilterCriteria>>;
};

export const TaskDraftBrowserContext = createContext<TaskDraftBrowserState | null>(null);

function Root({
    children,
    data,
    deletedTaskIds,
    setData,
    setDeletedTaskIds
}: {
    children?: ReactNode;
    data?: TaskDraft[];
    deletedTaskIds?: string[];
    setData?: Dispatch<SetStateAction<TaskDraft[]>>;
    setDeletedTaskIds?: Dispatch<SetStateAction<string[]>>;
}) {
    const [filters, setFilters] = useState<TaskDraftFilterCriteria>({});
    return (
        <TaskDraftBrowserContext.Provider
            value={{ data, deletedTaskIds, filters, setData, setDeletedTaskIds, setFilters }}
        >
            {children}
        </TaskDraftBrowserContext.Provider>
    );
}

function NameFilter() {
    const ctx = useContext(TaskDraftBrowserContext);
    if (ctx == null) throw new Error('NameFilter should be mounted inside Root component');
    const { setFilters } = ctx;

    const onChange = useDebouncedCallback((taskName?: TaskName) => {
        setFilters((prev) => ({ ...prev, nameId: taskName?.id }));
    }, 300);

    return (
        <Flex align="center" asChild gap="1">
            <label>
                <Text>Наименование</Text>
                <TaskNamesSelector onChange={onChange} />
            </label>
        </Flex>
    );
}

function NumberFilter() {
    const ctx = useContext(TaskDraftBrowserContext);
    if (ctx == null) throw new Error('NumberFilter should be mounted inside Root component');
    const { setFilters } = ctx;

    const onChange = useDebouncedCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
        setFilters((prev) => ({ ...prev, number: e.target.value }));
    }, 300);

    return <TextField.Root onChange={onChange} placeholder="Введите номер..." />;
}

function CreateButton() {
    const ctx = useContext(TaskDraftBrowserContext);
    if (ctx == null) throw new Error('CreateButton should be mounted inside Root component');
    const { setData } = ctx;

    const [isOpen, setIsOpen] = useState(false);
    const onSuccess = (draft: TaskDraft | TaskDTO) => {
        setData?.((prev) => [...prev, draft as TaskDraft]);
        setIsOpen(false);
    };
    return (
        <UpsertEntityDialog.Root onOpenChange={setIsOpen} open={isOpen} title="Создание задачи">
            <UpsertEntityDialog.Trigger
                onClick={() => {
                    setIsOpen(true);
                }}
                tooltip="Создать задачу"
            >
                <PlusIcon />
            </UpsertEntityDialog.Trigger>
            <UpsertEntityDialog.Content minWidth="60vw">
                <Box asChild pr="3">
                    <ScrollArea size="1" style={{ maxHeight: '85vh' }}>
                        <TaskForm end={<UpsertEntityDialog.Controller />} onSuccess={onSuccess} />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}

function DeleteButton({ task }: { task: TaskDraft | Task }) {
    const ctx = useContext(TaskDraftBrowserContext);
    if (ctx == null) throw new Error('DeleteButton should be mounted inside Root component');
    const { setData, setDeletedTaskIds } = ctx;

    const action = () => {
        setData?.((prev) => prev.filter(({ number }) => number !== task.number));
        if ('id' in task) setDeletedTaskIds?.((prev) => [...prev, task.id]);
    };
    return (
        <DeleteEntityDialog.Root confirmation={task.number} title="Удаление задачи">
            <DeleteEntityDialog.Trigger tooltip="Удалить задачу" />
            <DeleteEntityDialog.Content>
                <Flex asChild direction="column" gap="2">
                    <form action={action}>
                        <Text>
                            Вы действительно хотите удалить тип: <Strong>{task.number}</Strong>
                        </Text>
                        <Text>
                            Для удаления введите: <Strong>{task.number}</Strong>
                        </Text>
                        <DeleteEntityDialog.ConfirmationField />
                        <DeleteEntityDialog.Controller />
                    </form>
                </Flex>
            </DeleteEntityDialog.Content>
        </DeleteEntityDialog.Root>
    );
}

function EditButton({ task }: { task: TaskDraft }) {
    const ctx = useContext(TaskDraftBrowserContext);
    if (ctx == null) throw new Error('EditButton should be mounted inside Root component');
    const { setData } = ctx;

    const [isOpen, setIsOpen] = useState(false);
    const onSuccess = (draft: TaskDraft | TaskDTO) => {
        setData?.((prev) =>
            prev.map((item) => {
                if (item.number !== task.number) return item;
                return { ...item, ...draft };
            })
        );
        setIsOpen(false);
    };
    return (
        <UpsertEntityDialog.Root onOpenChange={setIsOpen} open={isOpen} title="Редактирование задачи">
            <UpsertEntityDialog.Trigger
                onClick={() => {
                    setIsOpen(true);
                }}
                tooltip="Редактировать задачу"
            >
                <Pencil1Icon />
            </UpsertEntityDialog.Trigger>
            <UpsertEntityDialog.Content minWidth="60vw">
                <Box asChild pr="3">
                    <ScrollArea size="1" style={{ maxHeight: '85vh' }}>
                        <TaskForm end={<UpsertEntityDialog.Controller />} onSuccess={onSuccess} task={task} />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}

export function useTasks(packageId: string, filters?: TaskDraftFilterCriteria) {
    const { data, mutate } = useSWR([`tasks`, filters], () => findAllTasks(packageId, filters), {
        suspense: true
    });

    return { data, mutate };
}

function Tasks({ actions, packageId }: { actions?: (task: Task) => ReactNode; packageId: string }) {
    const ctx = useContext(TaskDraftBrowserContext);
    if (ctx == null) throw new Error('DataList should be mounted inside Root component');
    const { filters } = ctx;

    const { data: tasks } = useTasks(packageId, filters);
    return (
        <>
            <TasksList actions={actions} data={tasks.items} packageId={packageId} />
            <Pagination data={tasks} />
        </>
    );
}

function DataList({ actions }: { actions?: (draft: TaskDraft) => ReactNode }) {
    const ctx = useContext(TaskDraftBrowserContext);
    if (ctx == null) throw new Error('DataList should be mounted inside Root component');
    const { data, filters } = ctx;

    const [pagination, setPagination] = useState<Required<PaginateOptions>>({ limit: 10, offset: 0 });
    const paginationInfo = { ...pagination, total: data?.length ?? 1 };

    const items = data?.filter((item) => {
        const isMatchName = filters.nameId == null || item.name.id === filters.nameId;
        const isMatchNumber = item.number
            .trim()
            .toLowerCase()
            .includes((filters.number ?? '').trim().toLowerCase());

        return isMatchName && isMatchNumber;
    });

    const onChangePagination = (options: Required<PaginateOptions>) => {
        setPagination(options);
    };

    return (
        <>
            <TaskDraftList actions={actions} data={items ?? []} />
            <Pagination data={paginationInfo} onChange={onChangePagination} />
        </>
    );
}

export const TaskDraftBrowser = {
    CreateButton,
    DataList,
    DeleteButton,
    EditButton,
    NameFilter,
    NumberFilter,
    Root,
    Tasks
};
