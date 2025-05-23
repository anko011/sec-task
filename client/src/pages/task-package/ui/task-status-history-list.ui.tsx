import useSWR from 'swr';
import { axiosInstance } from '~/shared/api';
import { GetTaskStatusHistoriesContract } from '~/entities/tasks';
import { Flex, Separator, Text } from '@radix-ui/themes';
import { createContext, Fragment, type ReactNode } from 'react';
import { TaskStatusBadge } from '~/entities/tasks/ui/task-status-badge.ui';
import { useStrictContext } from '~/shared/lib';
import { Loader } from '~/shared/ui/loader';

export function useTaskExecutionHistoryApi(packageId: string, taskId: string, organizationId: string) {
    return useSWR(
        `/task-packages/${packageId}/tasks/${taskId}/organizations/${organizationId}/execution-histories`,
        async (url) => {
            const response = await axiosInstance.get(url);
            return GetTaskStatusHistoriesContract.parse(response.data);
        }
    );
}

export const TaskExecutionHistoryContext = createContext<ReturnType<typeof useTaskExecutionHistoryApi> | null>(null);

export function TaskExecutionHistoryProvider({
    packageId,
    taskId,
    organizationId,
    children
}: {
    packageId: string;
    taskId: string;
    organizationId: string;
    children: ReactNode;
}) {
    const { data, isLoading, ...value } = useTaskExecutionHistoryApi(packageId, taskId, organizationId);
    return <TaskExecutionHistoryContext value={{ data, isLoading, ...value }}>{children}</TaskExecutionHistoryContext>;
}

export function TaskStatusHistory() {
    const { data, isLoading } = useStrictContext(TaskExecutionHistoryContext);

    if (!data || isLoading) return <Loader height="100%" />;

    return (
        <Flex direction="column" gap="2" mt="2">
            {data.map((history, i) => (
                <Fragment key={history.createdAt.toString()}>
                    {i !== 0 && <Separator my="2" size="4" />}
                    <Flex>
                        <Flex align="start" gap="2" minWidth="450px">
                            <Text size="2">{history.createdAt.toLocaleDateString('ru-RU')}</Text>
                            {!!history.oldStatus && (
                                <>
                                    <TaskStatusBadge status={history.oldStatus} /> →
                                </>
                            )}
                            <TaskStatusBadge status={history.newStatus} />
                        </Flex>
                        <Text size="2">{history.comment}</Text>
                    </Flex>
                </Fragment>
            ))}
            {data.length === 0 && <Text size="2">Отсутствует история</Text>}
        </Flex>
    );
}
