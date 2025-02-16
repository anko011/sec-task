import { Badge, DataList, Flex } from '@radix-ui/themes';
import { use } from 'react';

import { TaskCategoryBadge } from '~/entities/task-categories/@x/tasks';
import { Link } from '~/shared/ui/link';

import type { Task } from '../model/task';
import { TaskDangerStatusBadge } from './danger-status-badge.ui';

export type TaskInfoListProps = DataList.RootProps & {
    data: Task | Promise<Task>;
};

const files = [
    {
        name: 'Документ 1.pdf',
        url: '/'
    },
    {
        name: 'Документ 2.pdf',
        url: '/'
    },
    {
        name: 'Документ 3.pdf',
        url: '/'
    }
];

export function TaskInfoList({ data, ...props }: TaskInfoListProps) {
    const task = use(Promise.resolve(data));
    return (
        <DataList.Root size="2" {...props}>
            <DataList.Item>
                <DataList.Label>Название</DataList.Label>
                <DataList.Value>{task.name}</DataList.Value>
            </DataList.Item>

            <DataList.Item>
                <DataList.Label>Описание</DataList.Label>
                <DataList.Value>{task.description}</DataList.Value>
            </DataList.Item>

            <DataList.Item>
                <DataList.Label>Статус опасности</DataList.Label>
                <DataList.Value>
                    <TaskDangerStatusBadge status={task.dangerStatus} />
                </DataList.Value>
            </DataList.Item>

            <DataList.Item>
                <DataList.Label>Категория</DataList.Label>
                <DataList.Value>
                    <TaskCategoryBadge category={task.category} />
                </DataList.Value>
            </DataList.Item>

            <DataList.Item>
                <DataList.Label>Прикрепленные файлы</DataList.Label>
                <DataList.Value>
                    <Flex gap="2">
                        {files.map((file) => (
                            <Link key={file.name} to={file.url}>
                                <Badge>{file.name}</Badge>
                            </Link>
                        ))}
                    </Flex>
                </DataList.Value>
            </DataList.Item>
        </DataList.Root>
    );
}
