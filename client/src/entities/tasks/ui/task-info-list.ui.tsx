import { DataList, Progress, Text } from '@radix-ui/themes';
import useSWR from 'swr';

import { TaskCategoryBadge } from '~/entities/task-categories';
import { TaskStatusBadge } from '~/entities/tasks';
import { Role, useCurrentUser } from '~/entities/users';
import { axiosInstance } from '~/shared/api';

import type { Task, TaskStatus } from '../model/task';
import { TaskDangerStatusBadge } from './danger-status-badge.ui';

export type TaskInfoListProps = DataList.RootProps & {
    packageId: string;
    task: Task;
};

export function TaskInfoList({ packageId, task, ...props }: TaskInfoListProps) {
    const { user } = useCurrentUser();
    if (user == null) throw new Error('Task info list should be mounted after user was signed');

    const { data: extensions } = useSWR(
        user.role === Role.Assigner ? 'exchangeByOrg' : null,
        async () => {
            const response = await axiosInstance.get<
                {
                    organizationId: string;
                    status: TaskStatus;
                    statusHistory: {
                        changedAt: string;
                        comment: string;
                        newStatus: TaskStatus;
                        oldStatus?: TaskStatus;
                    }[];
                    taskId: string;
                }[]
            >(`task-packages/${packageId}/tasks/${task.id}/executions?organizationId=${user.organizationId}`);
            return response.data;
        },
        { suspense: true }
    );

    const status = user.role === Role.Assigner ? extensions.flat().at(0)?.status : undefined;

    return (
        <DataList.Root key={task.id} size="1" {...props}>
            <DataList.Item>
                <DataList.Label minWidth="88px">Номер</DataList.Label>
                <DataList.Value>{task.number}</DataList.Value>
            </DataList.Item>

            <DataList.Item>
                <DataList.Label minWidth="88px">Наименование</DataList.Label>
                <DataList.Value>{task.name.name}</DataList.Value>
            </DataList.Item>

            {user.role === Role.Assigner && status != null && (
                <DataList.Item>
                    <DataList.Label minWidth="88px">Статус</DataList.Label>
                    <DataList.Value>
                        <TaskStatusBadge status={status} />
                    </DataList.Value>
                </DataList.Item>
            )}

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
                <DataList.Value>{task.CVE?.join(', ')}</DataList.Value>
            </DataList.Item>

            <DataList.Item>
                <DataList.Label minWidth="88px">BDU</DataList.Label>
                <DataList.Value>{task.BDU?.join(', ')}</DataList.Value>
            </DataList.Item>

            <DataList.Item>
                <DataList.Label minWidth="88px">Срок исполнения</DataList.Label>
                <DataList.Value>
                    <Text>{task.deadline.toLocaleDateString('ru-RU')}</Text>
                </DataList.Value>
            </DataList.Item>

            <DataList.Item>
                <DataList.Label minWidth="88px">Дата исполнения</DataList.Label>
                <DataList.Value>
                    <Text> - </Text>
                </DataList.Value>
            </DataList.Item>

            {user.role !== Role.Assigner && (
                <DataList.Item>
                    <DataList.Label minWidth="88px">Прогресс</DataList.Label>
                    <DataList.Value>
                        <Progress highContrast mt="1" size="3" value={task.progress.percentage} />
                    </DataList.Value>
                </DataList.Item>
            )}
        </DataList.Root>
    );
}
