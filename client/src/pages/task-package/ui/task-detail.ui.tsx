import { type Task, TaskDangerStatusBadge } from '~/entities/tasks';
import { DataList, Flex, Heading, Progress, Separator, Text } from '@radix-ui/themes';
import { TaskCategoryBadge } from '~/entities/task-categories';
import type { ReactNode } from 'react';

export function TaskDetail({ task, end }: { task: Task; end?: ReactNode }) {
    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Heading size="4">Информация о задаче</Heading>
            <Separator size="4" />

            <DataList.Root key={task.id} size="1">
                <DataList.Item>
                    <DataList.Label minWidth="88px">Номер</DataList.Label>
                    <DataList.Value>{task.number}</DataList.Value>
                </DataList.Item>

                <DataList.Item>
                    <DataList.Label minWidth="88px">Наименование</DataList.Label>
                    <DataList.Value>{task.name.title}</DataList.Value>
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
                    <DataList.Value>{task.cve?.join(', ')}</DataList.Value>
                </DataList.Item>

                <DataList.Item>
                    <DataList.Label minWidth="88px">BDU</DataList.Label>
                    <DataList.Value>{task.bdu?.join(', ')}</DataList.Value>
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

                <DataList.Item>
                    <DataList.Label minWidth="88px">Прогресс</DataList.Label>
                    <DataList.Value>
                        <Progress highContrast mt="1" size="3" value={task.progress} />
                    </DataList.Value>
                </DataList.Item>
            </DataList.Root>

            <Heading size="4">Описание</Heading>
            <Separator size="4" />
            <Text size="2" wrap="pretty">
                {task.description}
            </Text>

            {!!task.additionalInformation && task.additionalInformation !== '' && (
                <>
                    <Heading size="4">Дополнительные сведения</Heading>
                    <Separator size="4" />
                    <Text size="2" wrap="pretty">
                        {task.additionalInformation}
                    </Text>
                </>
            )}

            {end}
        </Flex>
    );
}
