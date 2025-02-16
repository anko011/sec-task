import { Badge, DataList } from '@radix-ui/themes';
import { type ReactNode, use } from 'react';

import type { TaskPackage } from '~/entities/task-packages';
import { TaskPackageStatus } from '~/entities/task-packages';

export type TaskPackageInfoListProps = DataList.RootProps & {
    data: Promise<TaskPackage>;
};

const taskPackStatusBadges: Record<TaskPackageStatus, ReactNode> = {
    [TaskPackageStatus.ACTIVE]: <Badge color="jade">Активен</Badge>,
    [TaskPackageStatus.FIXED]: <Badge color="yellow">Зафиксирован</Badge>
};

export function TaskPackageInfoList({ data, ...props }: TaskPackageInfoListProps) {
    const taskPackage = use(data);
    return (
        <DataList.Root size="2" {...props}>
            <DataList.Item>
                <DataList.Label>Название</DataList.Label>
                <DataList.Value>{taskPackage.name}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
                <DataList.Label>Статус</DataList.Label>
                <DataList.Value>{taskPackStatusBadges[taskPackage.status]}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
                <DataList.Label>Количество задач:</DataList.Label>
                <DataList.Value>{taskPackage.tasksNumber}</DataList.Value>
            </DataList.Item>
        </DataList.Root>
    );
}
