import type { FlexProps } from '@radix-ui/themes';
import { Card, DataList, Dialog, Flex, Link, Progress, ScrollArea, Text } from '@radix-ui/themes';
import { createContext, type ReactNode } from 'react';

import { TaskCategoryBadge } from '~/entities/task-categories';
import { useStrictContext } from '~/shared/lib';
import { type Task, TaskDangerStatusBadge } from '~/entities/tasks';
import { useCurrentUser } from '~/entities/users';
import {
    ExecutionFetcher,
    TaskExecutionContext
} from '~/pages/task-package/ui/task-executions-accordion-by-organizations.ui';
import { Loader } from '~/shared/ui/loader';
import { TaskStatusBadge } from '~/entities/tasks/ui/task-status-badge.ui';

export type TaskListProps = FlexProps & {
    actions?: (task: Task) => ReactNode;
    data: Task[];
    dialogContent: (task: Task) => ReactNode;
};

export const TaskCardContext = createContext<{ task: Task } | null>(null);

function TaskCardDetailLink({ dialogContent }: { dialogContent: (task: Task) => ReactNode }) {
    const { task } = useStrictContext(TaskCardContext);

    return (
        <DataList.Item>
            <DataList.Label minWidth="88px">Номер</DataList.Label>
            <DataList.Value>
                <Dialog.Root>
                    <Dialog.Trigger>
                        <Link size="1" style={{ cursor: 'var(--cursor-link)' }}>
                            {task.number}
                        </Link>
                    </Dialog.Trigger>
                    <Dialog.Content minWidth="80vw">
                        <Dialog.Title>{task.name.title}</Dialog.Title>
                        <ScrollArea style={{ height: '80vh' }}>{dialogContent(task)}</ScrollArea>
                    </Dialog.Content>
                </Dialog.Root>
            </DataList.Value>
        </DataList.Item>
    );
}

function TaskCardName() {
    const { task } = useStrictContext(TaskCardContext);
    return (
        <DataList.Item>
            <DataList.Label minWidth="88px">Наименование</DataList.Label>
            <DataList.Value>{task.name.title}</DataList.Value>
        </DataList.Item>
    );
}

function TaskCardCategory() {
    const { task } = useStrictContext(TaskCardContext);
    return (
        <DataList.Item>
            <DataList.Label minWidth="88px">Категория задачи</DataList.Label>
            <DataList.Value>
                <TaskCategoryBadge category={task.category} />
            </DataList.Value>
        </DataList.Item>
    );
}

function TaskCardDangerStatus() {
    const { task } = useStrictContext(TaskCardContext);
    return (
        <DataList.Item>
            <DataList.Label minWidth="88px">Уровень критичности</DataList.Label>
            <DataList.Value>
                <TaskDangerStatusBadge status={task.dangerStatus} />
            </DataList.Value>
        </DataList.Item>
    );
}

function TaskCardCve() {
    const { task } = useStrictContext(TaskCardContext);
    return (
        <DataList.Item>
            <DataList.Label minWidth="88px">CVE</DataList.Label>
            <DataList.Value>{task.cve.join(', ')}</DataList.Value>
        </DataList.Item>
    );
}

function TaskCardBdu() {
    const { task } = useStrictContext(TaskCardContext);
    return (
        <DataList.Item>
            <DataList.Label minWidth="88px">BDU</DataList.Label>
            <DataList.Value>{task.bdu.join(', ')}</DataList.Value>
        </DataList.Item>
    );
}

function TaskCardDeadline() {
    const { task } = useStrictContext(TaskCardContext);
    return (
        <DataList.Item>
            <DataList.Label minWidth="88px">Дата исполнения</DataList.Label>
            <DataList.Value>
                <Text>{task.deadline.toLocaleDateString('ru-RU')}</Text>
            </DataList.Value>
        </DataList.Item>
    );
}

function TaskCardProgress() {
    const { task } = useStrictContext(TaskCardContext);
    return (
        <DataList.Item>
            <DataList.Label minWidth="88px">Прогресс</DataList.Label>
            <DataList.Value>
                <Progress highContrast mt="1" size="3" value={task.progress} />
            </DataList.Value>
        </DataList.Item>
    );
}

function TaskCardStatus() {
    const { data } = useStrictContext(TaskExecutionContext);
    if (!data) return <Loader height="100%" />;
    return (
        <DataList.Item>
            <DataList.Label minWidth="88px">Статус</DataList.Label>
            <DataList.Value>
                <TaskStatusBadge status={data.lastStatus} />
            </DataList.Value>
        </DataList.Item>
    );
}

function TaskCardRoot({
    task,
    children,
    actions
}: {
    actions?: (task: Task) => ReactNode;
    task: Task;
    children: ReactNode;
}) {
    return (
        <Card key={task.id}>
            <TaskCardContext value={{ task }}>
                <Flex justify="between">
                    <DataList.Root key={task.id} size="1" style={{ flex: 1 }}>
                        {children}
                    </DataList.Root>
                    {actions?.(task)}
                </Flex>
            </TaskCardContext>
        </Card>
    );
}

export function AssignerTasksList({ actions, data, dialogContent, ...props }: TaskListProps) {
    const { user } = useCurrentUser();
    if (!user) throw new Error('user not defined');
    return (
        <Flex direction="column" gap="2" {...props}>
            {data.map((task) => (
                <ExecutionFetcher
                    key={task.id}
                    packageId={task.taskPackage}
                    taskId={task.id}
                    organizationId={user.organization ?? ''}
                >
                    <TaskCardRoot task={task} actions={actions}>
                        <TaskCardDetailLink dialogContent={dialogContent} />
                        <TaskCardStatus />
                        <TaskCardName />
                        <TaskCardCategory />
                        <TaskCardDangerStatus />
                        <TaskCardCve />
                        <TaskCardBdu />
                        <TaskCardDeadline />
                    </TaskCardRoot>
                </ExecutionFetcher>
            ))}

            {!data.length && <Text>Отсутствуют элементы</Text>}
        </Flex>
    );
}

export function TasksList({ actions, data, dialogContent, ...props }: TaskListProps) {
    return (
        <Flex direction="column" gap="2" {...props}>
            {data.map((task) => (
                <TaskCardRoot key={task.id} task={task} actions={actions}>
                    <TaskCardDetailLink dialogContent={dialogContent} />
                    <TaskCardName />
                    <TaskCardCategory />
                    <TaskCardDangerStatus />
                    <TaskCardCve />
                    <TaskCardBdu />
                    <TaskCardDeadline />
                    <TaskCardProgress />
                </TaskCardRoot>
            ))}
            {!data.length && <Text>Отсутствуют элементы</Text>}
        </Flex>
    );
}
