import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { Badge, DataList, Flex, Select, TextArea } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { Suspense, useActionState, useState } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';

import { getOrganizationById, OrganizationsTable } from '~/entities/organizations';
import { getTaskPackageById } from '~/entities/task-packages';
import { TaskStatus } from '~/entities/tasks';
import { updateTaskStatus } from '~/entities/tasks/api/repository';
import { Role, useCurrentUser } from '~/entities/users';
import { Can } from '~/features/ability';
import { TaskDraftBrowser } from '~/features/tasks/create';
import { useTasks } from '~/features/tasks/create/ui/task-draft-browser.ui';
import type { PaginateOptions } from '~/shared/api';
import { axiosInstance, getFieldErrors } from '~/shared/api';
import { FormField } from '~/shared/ui/form-field';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog/index';

type ChangeTaskStatusFormState = {
    comment?: string;
    isSuccess: boolean;
    status?: string;
};

const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
    [TaskStatus.COMPENSATED]: [TaskStatus.IN_PROGRESS],
    [TaskStatus.COMPLETED]: [TaskStatus.IN_PROGRESS],
    [TaskStatus.IN_PROGRESS]: [TaskStatus.COMPLETED, TaskStatus.NO_ACTUAL, TaskStatus.COMPENSATED],
    [TaskStatus.NEW]: [TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED, TaskStatus.COMPENSATED, TaskStatus.NO_ACTUAL],
    [TaskStatus.NO_ACTUAL]: [TaskStatus.IN_PROGRESS]
};

const texts: Record<TaskStatus, string> = {
    [TaskStatus.COMPENSATED]: 'Приняты компенсирующие меры',
    [TaskStatus.COMPLETED]: 'Выполнен',
    [TaskStatus.IN_PROGRESS]: 'В процессе',
    [TaskStatus.NEW]: 'Новый',
    [TaskStatus.NO_ACTUAL]: 'Не актуален'
};

function ChangeTaskStatusForm({
    end,
    onSuccess,
    organizationId,
    packageId,
    status,
    taskId
}: {
    end?: ReactNode;
    onSuccess?: () => void;
    organizationId: string;
    packageId: string;
    status?: TaskStatus;
    taskId: string;
}) {
    const { user } = useCurrentUser();
    const { data: extensions, mutate: extensionMutate } = useSWR(
        user?.role === Role.Assigner ? 'exchangeByOrg' : null,
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
            >(`task-packages/${packageId}/tasks/${taskId}/executions?organizationId=${organizationId}`);
            return response.data;
        },
        { suspense: true }
    );

    const currStatus = status ?? (extensions.flat().at(0)?.status as TaskStatus);
    const { mutate } = useTasks(packageId, {});

    const action = async (_: ChangeTaskStatusFormState, formData: FormData): Promise<ChangeTaskStatusFormState> => {
        try {
            await updateTaskStatus(packageId, taskId, {
                comment: formData.get('comment'),
                organizationId,
                status: formData.get('status')
            });
            await mutate();
            await extensionMutate();
            onSuccess?.();
            return { isSuccess: true };
        } catch (error) {
            return { isSuccess: false, ...getFieldErrors(error) };
        }
    };

    const [state, dispatch] = useActionState(action, { isSuccess: true });

    const transitions = allowedTransitions[currStatus];

    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <FormField error={state.status} label="Статус">
                    <Select.Root name="status">
                        <Select.Trigger />
                        <Select.Content>
                            {transitions.map((item) => (
                                <Select.Item key={item} value={item}>
                                    {texts[item]}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Root>
                </FormField>

                <FormField error={state.comment} label="Комментарий">
                    <TextArea name="comment" style={{ height: '500px' }} />
                </FormField>

                {end}
            </form>
        </Flex>
    );
}

export function ChangeTaskStatusButton({
    organizationId,
    packageId,
    status,
    taskId
}: {
    organizationId: string;
    packageId: string;
    status?: TaskStatus;
    taskId: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <UpsertEntityDialog.Root onOpenChange={setIsOpen} open={isOpen} title="Смена статуса">
            <UpsertEntityDialog.Trigger tooltip="Изменить статус">
                <PaperPlaneIcon />
            </UpsertEntityDialog.Trigger>
            <UpsertEntityDialog.Content minHeight="50vh">
                <ChangeTaskStatusForm
                    end={<UpsertEntityDialog.Controller />}
                    onSuccess={() => {
                        setIsOpen(false);
                    }}
                    organizationId={organizationId}
                    packageId={packageId}
                    status={status}
                    taskId={taskId}
                />
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}

function TaskPackageDetail({ packageId }: { packageId: string }) {
    const [orgPagination, setOrgPagination] = useState<PaginateOptions>({ limit: 10, offset: 0 });
    const { user } = useCurrentUser();

    const { data: taskPackage } = useSWR(`task-package/${packageId}`, () => getTaskPackageById(packageId), {
        suspense: true
    });

    const { data: organizations } = useSWR(
        'organizations',
        () => Promise.all(taskPackage.assignedOrganizationIds.map((id) => getOrganizationById(id))),
        { suspense: true }
    );

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

            <DataList.Item align="center">
                <DataList.Label>Прикрепленные файлы</DataList.Label>
                <DataList.Value>
                    <Flex gap="2">
                        <Badge>Файл #1.docx</Badge>
                        <Badge>Файл #2.docx</Badge>
                        <Badge>Файл #3.docx</Badge>
                        <Badge>Файл #4.docx</Badge>
                    </Flex>
                </DataList.Value>
            </DataList.Item>

            <DataList.Item align="center">
                <DataList.Label>Задачи</DataList.Label>
                <DataList.Value>
                    <Flex direction="column" gap="2" width="100%">
                        <TaskDraftBrowser.Root>
                            <Flex gap="2">
                                <TaskDraftBrowser.NumberFilter />
                                <TaskDraftBrowser.NameFilter />
                            </Flex>
                            <Suspense fallback={<Loader />}>
                                <TaskDraftBrowser.Tasks
                                    actions={
                                        user?.role === Role.Assigner
                                            ? (task) => (
                                                  <ChangeTaskStatusButton
                                                      organizationId={user.organizationId}
                                                      packageId={packageId}
                                                      taskId={task.id}
                                                  />
                                              )
                                            : undefined
                                    }
                                    packageId={packageId}
                                />
                            </Suspense>
                        </TaskDraftBrowser.Root>
                    </Flex>
                </DataList.Value>
            </DataList.Item>

            <Can an="Organization" I="read">
                <DataList.Item align="center">
                    <DataList.Label>Исполнители</DataList.Label>
                    <DataList.Value>
                        <Flex direction="column" gap="2" width="100%">
                            <OrganizationsTable data={organizations} />
                            <Pagination
                                data={{
                                    limit: orgPagination.limit ?? 10,
                                    offset: orgPagination.offset ?? 0,
                                    total: taskPackage.assignedOrganizationIds.length
                                }}
                                onChange={setOrgPagination}
                            />
                        </Flex>
                    </DataList.Value>
                </DataList.Item>
            </Can>
        </DataList.Root>
    );
}

export function TaskPackagePage() {
    const params = useParams();
    const packageId = params.id ?? '';

    return (
        <Flex direction="column" minHeight="100%" p="4">
            <Suspense fallback={<Loader />}>
                <TaskPackageDetail packageId={packageId} />
            </Suspense>
        </Flex>
    );
}
