import { DataList, Progress, Text } from '@radix-ui/themes';
import { use } from 'react';

import { TaskCategoryBadge } from '~/entities/task-categories/@x/tasks';

import type { Task } from '../model/task';
import { TaskDangerStatusBadge } from './danger-status-badge.ui';

export type TaskInfoListProps = DataList.RootProps & {
    data: Task | Promise<Task>;
};

export function TaskInfoList({ data, ...props }: TaskInfoListProps) {
    const task = use(Promise.resolve(data));
    return (
        <DataList.Root key={task.id} size="1" {...props}>
            <DataList.Item>
                <DataList.Label minWidth="88px">Номер</DataList.Label>
                <DataList.Value>358965</DataList.Value>
            </DataList.Item>

            <DataList.Item>
                <DataList.Label minWidth="88px">Наименование</DataList.Label>
                <DataList.Value>{task.name}</DataList.Value>
            </DataList.Item>

            <DataList.Item>
                <DataList.Label minWidth="88px">Категория задачи</DataList.Label>
                <DataList.Value>
                    <TaskCategoryBadge category={task.category} />
                </DataList.Value>
            </DataList.Item>

            <DataList.Item>
                <DataList.Label minWidth="88px">Уровень критичности</DataList.Label>
                <DataList.Value>
                    <TaskDangerStatusBadge status={task.dangerStatus} />
                </DataList.Value>
            </DataList.Item>

            <DataList.Item>
                <DataList.Label minWidth="88px">CVE</DataList.Label>
                <DataList.Value>123</DataList.Value>
            </DataList.Item>

            <DataList.Item>
                <DataList.Label minWidth="88px">BDU</DataList.Label>
                <DataList.Value>123</DataList.Value>
            </DataList.Item>

            <DataList.Item>
                <DataList.Label minWidth="88px">Срок исполнения</DataList.Label>
                <DataList.Value>
                    <Text>{new Date(2025, 11, 20).toLocaleDateString('ru')}</Text>
                </DataList.Value>
            </DataList.Item>

            <DataList.Item>
                <DataList.Label minWidth="88px">Дата исполнения</DataList.Label>
                <DataList.Value>
                    <Text>{new Date(2025, 11, 22).toLocaleDateString('ru')}</Text>
                </DataList.Value>
            </DataList.Item>

            <DataList.Item>
                <DataList.Label minWidth="88px">Прогресс</DataList.Label>
                <DataList.Value>
                    <Progress highContrast mt="1" size="3" value={Math.random() * 100} />
                </DataList.Value>
            </DataList.Item>
        </DataList.Root>
    );
}
