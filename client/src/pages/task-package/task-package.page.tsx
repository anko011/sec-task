import { Badge, DataList, Flex, Link } from '@radix-ui/themes';
import { useParams } from 'react-router';

import { OrganizationsView } from '~/entities/organizations';
import { TaskPackageStatus, type TaskPackageWithTasks, useTaskPackage } from '~/entities/task-packages';
import { Can } from '~/features/ability';
import { Loader } from '~/shared/ui/loader';
import { TaskExecutionsAccordionByOrganizations } from './ui/task-executions-accordion-by-organizations.ui';
import { TaskExecutionHistoryProvider, TaskStatusHistory } from './ui/task-status-history-list.ui';
import { ChangeTaskStatusButton } from './ui/change-status-button.ui';
import { TasksView } from './ui/tasks-view.ui';
import { TaskDetail } from './ui/task-detail.ui';
import { Role, useCurrentUser } from '~/entities/users';

function TaskPackageDetail({ taskPackage }: { taskPackage: TaskPackageWithTasks }) {
    const { user } = useCurrentUser();
    if (!user) throw new Error('User cannot find a user');

    const TaskList = user.role === Role.Assigner ? TasksView.AssignerDataList : TasksView.DataList;

    return (
        <DataList.Root size="2">
            <DataList.Item align="center">
                <DataList.Label>Входящий реквизит</DataList.Label>
                <DataList.Value>{taskPackage.incomingRequisite}</DataList.Value>
            </DataList.Item>

            <DataList.Item align="center">
                <DataList.Label>Исходящий реквизит</DataList.Label>
                <DataList.Value>{taskPackage.outgoingRequisite}</DataList.Value>
            </DataList.Item>

            {!!taskPackage.attachments.length && (
                <DataList.Item align="center">
                    <DataList.Label>Прикрепленные файлы</DataList.Label>
                    <DataList.Value>
                        <Flex gap="2" wrap="wrap">
                            {taskPackage.attachments.map((item) => (
                                <Link key={item.id} href={`/${item.path}`} target="_parent" download>
                                    <Badge>{item.filename}</Badge>
                                </Link>
                            ))}
                        </Flex>
                    </DataList.Value>
                </DataList.Item>
            )}

            <DataList.Item align="center">
                <DataList.Label>Задачи</DataList.Label>
                <DataList.Value>
                    <Flex direction="column" gap="2" width="100%">
                        <TasksView.Root taskPackageId={taskPackage.id}>
                            <Flex gap="2" width="60%">
                                <TasksView.NumberFilter />
                                <TasksView.NameFilter />
                                <TasksView.CategoryFilter />
                                <TasksView.DangerStatusFilter />
                            </Flex>
                            <TaskList
                                actions={
                                    user.role === Role.Assigner && taskPackage.status !== TaskPackageStatus.FIXED
                                        ? (task) => (
                                              <ChangeTaskStatusButton taskId={task.id} packageId={taskPackage.id} />
                                          )
                                        : undefined
                                }
                                dialogContent={(task) => (
                                    <TaskDetail
                                        task={task}
                                        end={
                                            user?.role !== Role.Assigner ? (
                                                <TaskExecutionsAccordionByOrganizations
                                                    packageId={taskPackage.id}
                                                    taskId={task.id}
                                                    openContentLabel="Открыть историю"
                                                    action={
                                                        taskPackage.status !== TaskPackageStatus.FIXED && (
                                                            <ChangeTaskStatusButton
                                                                taskId={task.id}
                                                                packageId={taskPackage.id}
                                                            />
                                                        )
                                                    }
                                                    content={<TaskStatusHistory />}
                                                />
                                            ) : (
                                                <TaskExecutionHistoryProvider
                                                    packageId={taskPackage.id}
                                                    taskId={task.id}
                                                    organizationId={user.organization ?? ''}
                                                >
                                                    <TaskStatusHistory />
                                                </TaskExecutionHistoryProvider>
                                            )
                                        }
                                    />
                                )}
                            />
                        </TasksView.Root>
                    </Flex>
                </DataList.Value>
            </DataList.Item>

            <Can an="Organization" I="read">
                <DataList.Item align="center">
                    <DataList.Label>Исполнители</DataList.Label>
                    <DataList.Value>
                        <Flex direction="column" width="100%">
                            <OrganizationsView.TaskPackageRoot taskPackageId={taskPackage.id}>
                                <Flex gap="2" width="50%">
                                    <OrganizationsView.NameFilter />
                                    <OrganizationsView.TypeFilter />
                                    <OrganizationsView.ArchivedFilter />
                                </Flex>
                                <OrganizationsView.DataTable />
                            </OrganizationsView.TaskPackageRoot>
                        </Flex>
                    </DataList.Value>
                </DataList.Item>
            </Can>
        </DataList.Root>
    );
}

export default function TaskPackagePage() {
    const params = useParams();
    const packageId = params.id;

    if (!packageId) throw new Error('Not defined package id');

    const { data, isLoading } = useTaskPackage(packageId);

    if (!data || isLoading) return <Loader height="100%" />;

    return (
        <Flex direction="column" gap="4" minHeight="100%" p="4">
            <TaskPackageDetail taskPackage={data} />
        </Flex>
    );
}
