import { Badge, DataList, Flex } from '@radix-ui/themes';
import { type ReactNode, use } from 'react';

import type { TaskPackage } from '~/entities/task-packages';
import { TaskPackageStatus } from '~/entities/task-packages';
import { Link } from '~/shared/ui/link';

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
        <DataList.Root size="1" {...props}>
            <DataList.Item>
                <DataList.Label>Входящие реквизиты</DataList.Label>
                <DataList.Value>{taskPackage.incomingRequisite}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
                <DataList.Label>Исходящие реквизиты</DataList.Label>
                <DataList.Value>{taskPackage.outgoingRequisite}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
                <DataList.Label>Статус</DataList.Label>
                <DataList.Value>{taskPackStatusBadges[taskPackage.status]}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
                <DataList.Label>Количество задач</DataList.Label>
                <DataList.Value>{taskPackage.tasksNumber}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
                <DataList.Label>Документы</DataList.Label>
                <Flex asChild gap="2" ml="-2">
                    <DataList.Value>
                        <Link asChild to="#">
                            <Badge>Файл №1.docx</Badge>
                        </Link>
                        <Link asChild to="#">
                            <Badge>Файл №2.docx</Badge>
                        </Link>
                        <Link asChild to="#">
                            <Badge>Файл №3.docx</Badge>
                        </Link>
                    </DataList.Value>
                </Flex>
            </DataList.Item>
        </DataList.Root>
    );
}
