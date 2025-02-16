import { Button, Flex, Heading, Separator, Text, TextField } from '@radix-ui/themes';
import { startTransition, Suspense, useState } from 'react';

import { assignees } from '~/entities/assignees/mock';
import { taskCategories } from '~/entities/task-categories/mock';
import { TaskDangerStatus, type TaskDTO, TaskDTOList } from '~/entities/tasks';
import { FilterTaskCategorySelector } from '~/features/task-categories/filter';
import { CreateTaskButton } from '~/features/tasks/create';
import { DeleteTaskButton } from '~/features/tasks/delete';
import { EditTaskButton } from '~/features/tasks/edit';
import { FilterTaskDangerStatusSelector } from '~/features/tasks/filter';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { SearchField } from '~/shared/ui/search-field';

const initialState = [
    {
        description: 'Описание задачи',
        name: 'Задача 1',
        assignees: [
            assignees['6ba7b810-9dad-11d1-80b4-00c05fd440c801'],
            assignees['6ba7b810-9dad-11d1-80b4-00c05fd440c802']
        ],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c801'],
        dangerStatus: TaskDangerStatus.CRITICAL
    },
    {
        description: 'Описание задачи',
        name: 'Задача 2',
        assignees: [assignees['6ba7b810-9dad-11d1-80b4-00c05fd440c803']],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c802'],
        dangerStatus: TaskDangerStatus.HIGH
    }
];

export function CreateTaskPackagePage() {
    const [tasks, setTasks] = useState<TaskDTO[]>(initialState);

    function handleCreateTask(dto: TaskDTO) {
        startTransition(() => {
            setTasks((prev) => [...prev, dto]);
        });
    }

    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Suspense fallback={<Loader />}>
                <Heading size="4">Информация о пакете</Heading>
                <Separator size="4" />

                <form>
                    <Flex asChild direction="column" gap="2">
                        <label>
                            <Text>Название:</Text>
                            <TextField.Root placeholder="Введите название пакета" />
                        </label>
                    </Flex>
                </form>

                <Heading size="4">Задачи</Heading>
                <Separator size="4" />

                <Flex gap="2">
                    <CreateTaskButton onCreateTask={handleCreateTask} />
                    <SearchField placeholder="Название задачи..." />
                    <FilterTaskCategorySelector />
                    <FilterTaskDangerStatusSelector />
                </Flex>

                <TaskDTOList
                    actions={(task) => (
                        <Flex gap="2">
                            <EditTaskButton task={task} />
                            <DeleteTaskButton task={task} />
                        </Flex>
                    )}
                    data={Promise.resolve(tasks)}
                />

                <Flex align="center" justify="between">
                    <Pagination currentPage={5} totalPages={10} />
                    <Button>Создать</Button>
                </Flex>
            </Suspense>
        </Flex>
    );
}
