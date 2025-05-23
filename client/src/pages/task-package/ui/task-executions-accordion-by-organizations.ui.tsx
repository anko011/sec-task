import { Button, DataList, Flex, Heading, Separator } from '@radix-ui/themes';
import useSWR from 'swr';
import { axiosInstance } from '~/shared/api';
import { GetTaskExecutionContract, GetTaskExecutionsContract } from '~/entities/tasks';
import { Accordion } from 'radix-ui';
import { TaskStatusBadge } from '~/entities/tasks/ui/task-status-badge.ui';
import { createContext, type ReactNode } from 'react';
import { TaskExecutionHistoryProvider } from '~/pages/task-package/ui/task-status-history-list.ui';
import { Loader } from '~/shared/ui/loader';
import type { TaskExecution } from '~/entities/tasks/model/task-execution';

export function useTaskExecutionsApi(packageId: string, taskId: string) {
    return useSWR(`/task-packages/${packageId}/tasks/${taskId}/executions`, async (url: string) => {
        const response = await axiosInstance.get(url);
        return GetTaskExecutionsContract.parse(response.data);
    });
}

export const TaskExecutionsContext = createContext<ReturnType<typeof useTaskExecutionsApi> | null>(null);

export function useExecution(packageId: string, taskId: string, organizationId: string, fallbackData?: TaskExecution) {
    return useSWR(
        `/task-packages/${packageId}/tasks/${taskId}/organizations/${organizationId}/execution`,
        async (url) => {
            const response = await axiosInstance.get(url);
            return GetTaskExecutionContract.parse(response.data);
        },
        { fallbackData }
    );
}

export const TaskExecutionContext = createContext<ReturnType<typeof useExecution> | null>(null);

export function ExecutionFetcher({
    children,
    packageId,
    taskId,
    organizationId,
    fallbackData
}: {
    packageId: string;
    taskId: string;
    organizationId: string;
    children: ReactNode;
    fallbackData?: TaskExecution;
}) {
    const { data, isLoading, ...values } = useExecution(packageId, taskId, organizationId, fallbackData);
    if (!data || isLoading) return <Loader />;
    return <TaskExecutionContext value={{ data, isLoading, ...values }}>{children}</TaskExecutionContext>;
}

export function TaskExecutionsAccordionByOrganizations({
    content,
    action,
    openContentLabel,
    packageId,
    taskId
}: {
    packageId: string;
    taskId: string;
    content: ReactNode;
    action: ReactNode;
    openContentLabel: string;
}) {
    const { data, isLoading, ...values } = useTaskExecutionsApi(packageId, taskId);
    if (!data || isLoading) return <Loader height="100%" />;
    return (
        <TaskExecutionsContext value={{ data, isLoading, ...values }}>
            <Heading size="4">История выполнения</Heading>
            <Separator size="4" />
            <Accordion.Root asChild style={{ marginBottom: '1rem' }} type="multiple">
                <Flex direction="column" gap="4">
                    {data.map((execution) => (
                        <ExecutionFetcher
                            key={execution.organization.id}
                            organizationId={execution.organization.id}
                            packageId={execution.taskPackage}
                            taskId={execution.task}
                            fallbackData={execution}
                        >
                            <TaskExecutionHistoryProvider
                                packageId={execution.taskPackage}
                                taskId={execution.task}
                                organizationId={execution.organization.id}
                            >
                                <Accordion.Item value={execution.organization.id}>
                                    <Accordion.Header asChild>
                                        <Flex justify="between">
                                            <DataList.Root size="1">
                                                <DataList.Item>
                                                    <DataList.Label>Организация</DataList.Label>
                                                    <DataList.Value>{execution.organization.name}</DataList.Value>
                                                </DataList.Item>
                                                <DataList.Item>
                                                    <DataList.Label>Последний статус</DataList.Label>
                                                    <DataList.Value>
                                                        <TaskStatusBadge status={execution.lastStatus} />
                                                    </DataList.Value>
                                                </DataList.Item>
                                            </DataList.Root>
                                            <Flex gap="2">
                                                {action}
                                                <Accordion.Trigger asChild>
                                                    <Button variant="surface">{openContentLabel}</Button>
                                                </Accordion.Trigger>
                                            </Flex>
                                        </Flex>
                                    </Accordion.Header>

                                    <Accordion.Content>{content}</Accordion.Content>
                                </Accordion.Item>
                            </TaskExecutionHistoryProvider>
                        </ExecutionFetcher>
                    ))}
                </Flex>
            </Accordion.Root>
        </TaskExecutionsContext>
    );
}
