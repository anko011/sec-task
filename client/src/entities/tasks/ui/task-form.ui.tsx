import { Cross1Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Badge, Box, Flex, IconButton, Select, Spinner, Text, TextArea, TextField } from '@radix-ui/themes';
import { Suspense, useMemo, useRef, useState } from 'react';

import { AssigneesRepository, AssigneesTable } from '~/entities/assignees/@x/tasks';
import {
    TaskCategoriesRepository,
    TaskCategoriesSelector,
    type TaskCategory
} from '~/entities/task-categories/@x/tasks';
import { FileUploader } from '~/shared/ui/file-uploader';
import { Pagination } from '~/shared/ui/pagination';

import { TaskDangerStatus } from '../model/task';
import type { TaskDTO } from '../model/task.dto';

export type TaskFormProps = {
    formId: string;
    onSubmit?: (task: TaskDTO) => void;
    task?: TaskDTO | null;
};

export function TaskForm({ formId, onSubmit, task }: TaskFormProps) {
    const [files, setFiles] = useState<File[]>([]);
    const assignees = useMemo(() => AssigneesRepository.getAll(), []);
    const categories = useMemo(() => TaskCategoriesRepository.getAll(), []);

    const formRef = useRef<HTMLFormElement>(null);

    async function submit(formData: FormData) {
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const assigneeIds = formData.getAll('assignee') as string[];
        const dangerStatus = formData.get('dangerStatus') as TaskDangerStatus;
        const categoryId = formData.get('category') as string;

        const asg = await assignees;
        const ctg = await categories;

        onSubmit?.({
            description,
            name,
            assignees: asg.filter(({ id }) => assigneeIds.includes(id)),
            category: ctg.find(({ id }) => id === categoryId) as TaskCategory,
            dangerStatus
        });

        formRef.current?.reset();
    }

    return (
        <Flex asChild direction="column" gap="4">
            <form action={submit} id={formId} ref={formRef}>
                <label>
                    <Text as="div" mb="1" size="2" weight="bold">
                        Название
                    </Text>
                    <TextField.Root defaultValue={task?.name} name="name" placeholder="Введите название задачи..." />
                </label>

                <label>
                    <Text as="div" mb="1" size="2" weight="bold">
                        Уровень опасности
                    </Text>
                    <Select.Root defaultValue={TaskDangerStatus.CRITICAL} name="dangerStatus">
                        <Select.Trigger />
                        <Select.Content>
                            <Select.Item value={TaskDangerStatus.CRITICAL}>Критический</Select.Item>
                            <Select.Item value={TaskDangerStatus.HIGH}>Высокий</Select.Item>
                            <Select.Item value={TaskDangerStatus.MEDIUM}>Средний</Select.Item>
                            <Select.Item value={TaskDangerStatus.LOW}>Низкий</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </label>

                <label>
                    <Text as="div" mb="1" size="2" weight="bold">
                        Категория задачи
                    </Text>

                    <Suspense
                        fallback={
                            <Flex justify="center">
                                <Spinner size="3" />
                            </Flex>
                        }
                    >
                        <TaskCategoriesSelector data={categories} name="category" />
                    </Suspense>
                </label>

                <label>
                    <Text as="div" mb="1" size="2" weight="bold">
                        Описание задачи
                    </Text>
                    <TextArea
                        defaultValue={task?.description}
                        name="description"
                        placeholder="Введите описание задачи..."
                        style={{ height: '350px' }}
                    />
                </label>
                <Box>
                    <Text as="div" mb="1" size="2" weight="bold">
                        Файлы
                    </Text>
                    <FileUploader
                        name="files"
                        onFileUpload={(fl) => {
                            setFiles((prev) => [...prev, ...Array.from(fl)]);
                        }}
                    />

                    <Flex display="inline-flex" gap="2" mt="2" wrap="wrap">
                        {files.map((file, i) => (
                            <Badge key={i}>
                                {file.name}
                                <IconButton
                                    onClick={() => {
                                        setFiles((prev) => prev.filter((f) => f.name !== file.name));
                                    }}
                                    size="1"
                                    variant="ghost"
                                >
                                    <Cross1Icon />
                                </IconButton>
                            </Badge>
                        ))}
                    </Flex>
                </Box>

                <TextField.Root placeholder="Название организации...">
                    <TextField.Slot>
                        <IconButton size="1" variant="ghost">
                            <MagnifyingGlassIcon />
                        </IconButton>
                    </TextField.Slot>
                </TextField.Root>

                <Suspense
                    fallback={
                        <Flex justify="center">
                            <Spinner size="3" />
                        </Flex>
                    }
                >
                    <AssigneesTable data={assignees} defaultValue={task?.assignees} />
                    <Pagination currentPage={5} totalPages={10} />
                </Suspense>
            </form>
        </Flex>
    );
}
