import { Button, Flex } from '@radix-ui/themes';
import { startTransition, Suspense, useState } from 'react';

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

export type SearchableTaskDTOListProps = {};

const initialState: TaskDTO[] = [
    {
        description: 'Описание задачи',
        name: 'Задача 1',
        BDU: ['BDU:2025-04719', 'BDU:2025-03524', 'BDU:2025-03578', 'BDU:2025-12985'],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c801'],
        CVE: ['CVE-2015-9859', 'CVE-2015-8759', 'CVE-2015-2515'],
        dangerStatus: TaskDangerStatus.CRITICAL,
        number: '123321'
    },
    {
        description: 'Описание задачи',
        name: 'Задача 2',
        BDU: ['BDU:2025-04719', 'BDU:2025-03524', 'BDU:2025-03578', 'BDU:2025-12985'],
        category: taskCategories['6ba7b845-9dds-12a1-80b4-00c04ff431c802'],
        CVE: ['CVE-2015-9859', 'CVE-2015-8759', 'CVE-2015-2515'],
        dangerStatus: TaskDangerStatus.HIGH,
        number: '548968'
    }
];

export function SearchableTaskDTOList(props: SearchableTaskDTOListProps) {
    const [tasks, setTasks] = useState<TaskDTO[]>(initialState);

    function handleCreateTask(dto: TaskDTO) {
        startTransition(() => {
            setTasks((prev) => [...prev, dto]);
        });
    }

    return (
        <Flex direction="column" gap="2">
            <Flex gap="2">
                <CreateTaskButton onCreateTask={handleCreateTask} />
                <SearchField placeholder="Название задачи..." />
                <FilterTaskCategorySelector />
                <FilterTaskDangerStatusSelector />
            </Flex>

            <Suspense fallback={<Loader height="500px" />}>
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
                    <Pagination currentPage={5} totalPages={Promise.resolve(10)} />
                    <Button>Создать</Button>
                </Flex>
            </Suspense>
        </Flex>
    );
}
