import type { BadgeProps } from '@radix-ui/themes';
import { Badge, Box, Button, DataList, Flex, Heading, Separator, Text } from '@radix-ui/themes';
import { Accordion } from 'radix-ui';
import { Suspense, use } from 'react';

import { ChangeStatusesRepository } from '~/entities/organizations';
import type { StatusChange } from '~/entities/organizations/model/change-status';
import type { Task } from '~/entities/tasks';
import { TaskInfoList, TasksRepository, TaskStatus } from '~/entities/tasks';
import { Loader } from '~/shared/ui/loader';

function groupBy<T>(array: T[], getKey: (item: T) => string | number): Record<string, T[]> {
    return array.reduce<Record<string, T[]>>((result, item) => {
        const key = String(getKey(item));
        if (result[key] == null) {
            result[key] = [];
        }
        result[key].push(item);
        return result;
    }, {});
}

function TaskStatusBadge({ status }: { status: TaskStatus }) {
    const map: Record<TaskStatus, { color: BadgeProps['color']; text: string }> = {
        [TaskStatus.COMPENSATED]: { color: 'jade', text: 'Приняты компенсирующие меры' },
        [TaskStatus.COMPLETED]: { color: 'jade', text: 'Завершено' },
        [TaskStatus.IN_PROGRESS]: { color: 'yellow', text: 'В процессе' },
        [TaskStatus.NEW]: { color: 'blue', text: 'Новый' },
        [TaskStatus.NO_ACTUAL]: { color: 'yellow', text: 'Не актуальный' }
    };

    const { color, text } = map[status];
    return <Badge color={color}>{text}</Badge>;
}

export function TaskStatusHistoryAccordion({ data }: { data: Promise<StatusChange[]> }) {
    const changes = use(data);
    const changesByAssignee = groupBy(changes, (change) => change.organization.id);

    if (!changes.length) return <Text color="gray">Нет изменений статусов</Text>;

    return (
        <Accordion.Root asChild style={{ marginBottom: '1rem' }} type="multiple">
            <Flex direction="column" gap="4">
                {Object.entries(changesByAssignee).map(([organizationId, changes]) => (
                    <Accordion.Item key={organizationId} value={organizationId}>
                        <Accordion.Header asChild>
                            <Flex justify="between">
                                <DataList.Root size="2">
                                    <DataList.Item>
                                        <DataList.Label>Организация</DataList.Label>
                                        <DataList.Value>{changes.at(0)?.organization.name}</DataList.Value>
                                    </DataList.Item>
                                    <DataList.Item>
                                        <DataList.Label>Последний статус</DataList.Label>
                                        <DataList.Value>
                                            <TaskStatusBadge status={TaskStatus.COMPLETED} />
                                        </DataList.Value>
                                    </DataList.Item>
                                </DataList.Root>
                                <Accordion.Trigger asChild>
                                    <Button variant="surface">Открыть историю</Button>
                                </Accordion.Trigger>
                            </Flex>
                        </Accordion.Header>
                        <Accordion.Content asChild>
                            <Flex direction="column" gap="1" mt="2">
                                {changes.map((change) => (
                                    <DataList.Root key={change.id} size="1">
                                        <Separator size="4" />
                                        <DataList.Item>
                                            <Flex justify="between">
                                                <DataList.Label>
                                                    <Flex align="center" gap="2">
                                                        {change.changedAt.toLocaleDateString('ru-RU')}
                                                        {change.oldStatus !== undefined && (
                                                            <>
                                                                <TaskStatusBadge status={change.oldStatus} /> →
                                                            </>
                                                        )}
                                                        <TaskStatusBadge status={change.newStatus} />
                                                    </Flex>
                                                </DataList.Label>
                                                <Box maxWidth="70%">
                                                    <DataList.Value>{change.comment}</DataList.Value>
                                                </Box>
                                            </Flex>
                                        </DataList.Item>
                                    </DataList.Root>
                                ))}
                            </Flex>
                        </Accordion.Content>
                    </Accordion.Item>
                ))}
            </Flex>
        </Accordion.Root>
    );
}

export function TaskStatusHistory({ data }: { data: Promise<Task> }) {
    const task = use(data);
    const changes = ChangeStatusesRepository.findAll(
        { packageId: task.packageId, taskId: task.id },
        { limit: 100 }
    ).then(({ items }) => items);

    return (
        <Suspense fallback={<Loader />}>
            <TaskStatusHistoryAccordion data={changes} />
        </Suspense>
    );
}

export function TaskDetail({ packageId, taskId }: { packageId: string; taskId: string }) {
    const task = TasksRepository.getTask(packageId, taskId);

    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Suspense fallback={<Loader />}>
                <Heading size="4">Информация о задаче</Heading>
                <Separator size="4" />

                <TaskInfoList data={task} />

                <Heading size="4">Описание</Heading>
                <Separator size="4" />
                <Text size="2" wrap="pretty">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
                    pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed
                    diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl
                    malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad
                    litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur
                    adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium
                    tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus
                    nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit
                    semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
                    pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed
                    diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl
                    malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad
                    litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur
                    adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium
                    tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus
                    nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit
                    semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                </Text>

                <Heading size="4">Дополнительные сведения</Heading>
                <Separator size="4" />
                <Text size="2" wrap="pretty">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
                    pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed
                    diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl
                    malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad
                    litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur
                    adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium
                    tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus
                    nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit
                    semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
                    pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed
                    diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl
                    malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad
                    litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur
                    adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium
                    tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus
                    nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit
                    semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                </Text>

                <Heading size="4">История выполнения</Heading>
                <Separator size="4" />
                <Suspense fallback={<Loader />}>
                    <TaskStatusHistory data={task} />
                </Suspense>
            </Suspense>
        </Flex>
    );
}
