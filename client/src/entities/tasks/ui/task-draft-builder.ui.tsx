import { createContext, type Dispatch, type ReactNode, type SetStateAction, useState } from 'react';
import { Box, Flex, ScrollArea, Strong, Text } from '@radix-ui/themes';
import { z } from 'zod';
import { Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';
import { toast } from 'react-toastify';
import { useDebouncedCallback } from 'use-debounce';

import { TaskCategoriesSelector, type TaskCategory } from '~/entities/task-categories';
import { type TaskName, TaskNamesSelector } from '~/entities/task-names';

import type { PaginateOptions } from '~/shared/api';
import { takeFirstElements, useStrictContext } from '~/shared/lib';
import { Pagination } from '~/shared/ui/pagination';
import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';
import { DeleteEntityDialog } from '~/shared/ui/delete-entity-dialog';
import { MaskedFilterField } from '~/shared/ui/masked-filter-field';

import { useNumberMask } from '../lib/use-number-mask';
import type { TaskDraft } from '../model/task-draft';
import { TaskDangerStatus } from '../model/task-danger-status';

import { TaskDraftList, type TaskDraftListProps } from './task-draft-list.ui';
import { TaskForm, type TaskFormValues } from './task-form.ui';
import { TaskDangerStatusSelector } from './task-danger-status-selector.ui';

type TaskDraftFilters = Partial<{
    number: string;
    dangerStatus: TaskDangerStatus;
    name: TaskName;
    category: TaskCategory;
}>;

const TaskDraftBuilderContext = createContext<{
    taskDrafts: TaskDraft[];
    setTaskDrafts: Dispatch<SetStateAction<TaskDraft[]>>;
    filters: TaskDraftFilters;
    setFilters: (filters: TaskDraftFilters) => void;
} | null>(null);

const TaskDraftSchema = z.object({
    additionalInformation: z.string().optional(),
    number: z.string().nonempty({ message: 'Обязательное поле' }),
    description: z.string().nonempty({ message: 'Обязательное поле' }),
    bdu: z.array(z.string()),
    cve: z.array(z.string()),
    dangerStatus: z.nativeEnum(TaskDangerStatus, { message: 'Обязательное поле' }),
    name: z.object({ id: z.string(), title: z.string() }, { message: 'Обязательное поле' }),
    category: z.object({ id: z.string(), title: z.string(), color: z.string() }, { message: 'Обязательное поле' })
});

function useTaskFormHandler(mode: 'create' | 'edit', taskDraft?: TaskDraft, onSuccess?: () => void) {
    const { setTaskDrafts } = useStrictContext(TaskDraftBuilderContext);

    return (values: TaskFormValues) => {
        const validation = TaskDraftSchema.safeParse({ ...values, number: values.unmaskedNumber });
        if (validation.success) {
            const newDraft = { ...validation.data, number: values.maskedNumber } as TaskDraft;

            setTaskDrafts((prev) =>
                mode === 'create'
                    ? [...prev, newDraft]
                    : prev.map((draft) => (draft.number === taskDraft?.number ? newDraft : draft))
            );

            toast.success(
                `Задача ${values.maskedNumber} успешно ${mode === 'create' ? 'добавлена' : 'отредактирована'}`
            );

            onSuccess?.();

            return {};
        }

        return takeFirstElements(validation.error.flatten().fieldErrors);
    };
}

function Root({
    children,
    taskDrafts,
    setTaskDrafts
}: {
    taskDrafts: TaskDraft[];
    setTaskDrafts: Dispatch<SetStateAction<TaskDraft[]>>;
    children?: ReactNode;
}) {
    const [filters, setFilters] = useState<TaskDraftFilters>({});
    return (
        <TaskDraftBuilderContext.Provider value={{ taskDrafts, setTaskDrafts, filters, setFilters }}>
            {children}
        </TaskDraftBuilderContext.Provider>
    );
}

function DataList(props: Omit<TaskDraftListProps, 'data'>) {
    const { taskDrafts, filters } = useStrictContext(TaskDraftBuilderContext);
    const [pagination, setPagination] = useState<PaginateOptions>({ limit: 10, offset: 0 });

    const filtered = taskDrafts.filter((draft) => {
        return (
            (!filters.name || filters.name.id === draft.name.id) &&
            (!filters.number || draft.number.toLowerCase().includes(filters.number.trim().toLowerCase())) &&
            (!filters.dangerStatus || filters.dangerStatus === draft.dangerStatus) &&
            (!filters.category || filters.category.id === draft.category.id)
        );
    });

    const paginated = filtered.slice(pagination.offset, pagination.offset + pagination.limit);

    return (
        <Flex direction="column" gap="2">
            <TaskDraftList data={paginated} {...props} />
            <Pagination data={{ ...pagination, total: filtered.length }} onChange={setPagination} />
        </Flex>
    );
}

function Create() {
    const [isOpen, setIsOpen] = useState(false);
    const action = useTaskFormHandler('create', undefined, () => {
        setIsOpen(false);
    });

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
                        <TaskForm end={<UpsertEntityDialog.Controller />} action={action} />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}

function Edit({ taskDraft }: { taskDraft: TaskDraft }) {
    const [isOpen, setIsOpen] = useState(false);
    const action = useTaskFormHandler('edit', taskDraft, () => {
        setIsOpen(false);
    });

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
                        <TaskForm task={taskDraft} end={<UpsertEntityDialog.Controller />} action={action} />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}

function Delete({ taskDraft }: { taskDraft: TaskDraft }) {
    const { setTaskDrafts } = useStrictContext(TaskDraftBuilderContext);

    const handleDelete = () => {
        setTaskDrafts((prev) => prev.filter((draft) => draft.number !== taskDraft.number));
        toast.success(`Задача ${taskDraft.number} успешно удалена`);
    };

    return (
        <DeleteEntityDialog.Root confirmation={taskDraft.number} title="Удаление задачи">
            <DeleteEntityDialog.Trigger tooltip="Удалить задачу" />
            <DeleteEntityDialog.Content>
                <form action={handleDelete}>
                    <Flex direction="column" gap="2">
                        <Text>
                            Вы действительно хотите удалить задачу: <Strong>{taskDraft.number}</Strong>
                        </Text>
                        <Text>
                            Для удаления введите: <Strong>{taskDraft.number}</Strong>
                        </Text>
                        <DeleteEntityDialog.ConfirmationField />
                        <DeleteEntityDialog.Controller />
                    </Flex>
                </form>
            </DeleteEntityDialog.Content>
        </DeleteEntityDialog.Root>
    );
}

function NumberFilter() {
    const { setFilters } = useStrictContext(TaskDraftBuilderContext);
    const { ref, setValue, unmaskedValue } = useNumberMask({
        onAccept: useDebouncedCallback(() => {
            setFilters({ number: unmaskedValue });
        }, 300)
    });

    return (
        <MaskedFilterField
            label="Номер"
            ref={ref}
            onClear={() => {
                setValue('');
            }}
        />
    );
}

function DangerStatusFilter() {
    const { setFilters } = useStrictContext(TaskDraftBuilderContext);
    return (
        <TaskDangerStatusSelector
            onValueChange={(dangerStatus) => {
                setFilters({ dangerStatus });
            }}
        />
    );
}

function CategoryFilter() {
    const { setFilters } = useStrictContext(TaskDraftBuilderContext);
    return (
        <TaskCategoriesSelector
            onChange={(category) => {
                setFilters({ category });
            }}
        />
    );
}

function NameFilter() {
    const { setFilters } = useStrictContext(TaskDraftBuilderContext);
    return (
        <TaskNamesSelector
            onChange={(name) => {
                setFilters({ name });
            }}
        />
    );
}

export const TaskDraftBuilder = {
    Root,
    DataList,
    NumberFilter,
    DangerStatusFilter,
    CategoryFilter,
    NameFilter,
    Create,
    Edit,
    Delete
};
