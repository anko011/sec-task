import { Button, Flex, Heading, Separator, Text, TextField } from '@radix-ui/themes';
import { startTransition, Suspense, use, useState } from 'react';
import { useParams } from 'react-router';

import type { TaskPackage } from '~/entities/task-packages';
import { TaskPackagesRepository } from '~/entities/task-packages';
import type { Task, TaskDTO } from '~/entities/tasks';
import { TaskDTOList, TasksRepository } from '~/entities/tasks';
import { CreateTaskButton } from '~/features/tasks/create';
import { DeleteTaskButton } from '~/features/tasks/delete';
import { EditTaskButton } from '~/features/tasks/edit';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { SearchField } from '~/shared/ui/search-field';

function mapToDTO(tasks: Task[]): TaskDTO[] {
    return tasks.map((task) => ({
        ...task,
        assignees: task.assigneeProgresses.map(({ assignee }) => assignee)
    }));
}

export function TaskPackageForm({ data }: { data: Promise<TaskPackage> }) {
    const info = use(data);
    return (
        <form>
            <Flex asChild direction="column" gap="2">
                <label>
                    <Text>Название:</Text>
                    <TextField.Root defaultValue={info.name} placeholder="Введите название пакета" />
                </label>
            </Flex>
        </form>
    );
}

export function EditTaskPackagePage() {
    const { id } = useParams();
    if (id == null) throw new Error('Not valid package ID');

    const [tasks, setTasks] = useState(TasksRepository.getPackageTasks(id).then(mapToDTO));
    const packageInfo = TaskPackagesRepository.getById(id);

    function handleCreateTask(dto: TaskDTO) {
        startTransition(() => {
            setTasks(async (prev) => {
                const data = await prev;
                return Promise.resolve([...data, dto]);
            });
        });
    }

    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Suspense fallback={<Loader />}>
                <Heading size="4">Информация о пакете</Heading>
                <Separator size="4" />

                <TaskPackageForm data={packageInfo} />

                <Heading size="4">Задачи</Heading>
                <Separator size="4" />

                <Flex gap="2">
                    <CreateTaskButton onCreateTask={handleCreateTask} />
                    <SearchField placeholder="Название задачи..." />
                </Flex>

                <TaskDTOList
                    actions={(task) => (
                        <Flex gap="2">
                            <EditTaskButton task={task} />
                            <DeleteTaskButton task={task} />
                        </Flex>
                    )}
                    data={tasks}
                />

                <Flex align="center" justify="between">
                    <Pagination currentPage={5} totalPages={10} />
                    <Button>Сохранить</Button>
                </Flex>
            </Suspense>
        </Flex>
    );
}
