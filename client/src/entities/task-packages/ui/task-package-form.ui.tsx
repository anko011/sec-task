import { Button, Checkbox, CheckboxGroup, DataList, Flex, Text, TextField } from '@radix-ui/themes';
import type { Ref } from 'react';
import { Suspense, useActionState, useEffect, useState } from 'react';
import { useIMask } from 'react-imask';
import useSWR from 'swr';

import { OrganizationBrowser } from '~/entities/organizations';
import { getTaskPackageById } from '~/entities/task-packages';
import type { Task } from '~/entities/tasks';
import { TaskDraftBrowser } from '~/features/tasks/create';
import type { TaskDraft } from '~/features/tasks/create/model';
import { axiosInstance } from '~/shared/api';
import { FileUploader } from '~/shared/ui/file-uploader';
import { Loader } from '~/shared/ui/loader';

export type TaskPackageFormState = {
    assignedOrganizationIds?: string;
    incomingRequisite?: string;
    isSuccess: boolean;
    outgoingRequisite?: string;
};

export type TaskPackageFormValues = {
    assignedOrganizationIds?: string[];
    deletedTaskIds: string[];
    incomingRequisite?: string;
    outgoingRequisite?: string;
    tasks: (TaskDraft | Task)[];
};

export function TaskPackageForm({
    action,
    taskPackageId
}: {
    action: (data: TaskPackageFormValues) => Promise<TaskPackageFormState>;
    taskPackageId?: string;
}) {
    const [isApplyAllOrganization, setIsApplyAllOrganization] = useState(false);
    const { data: orgIds } = useSWR(isApplyAllOrganization ? `organizations/ids` : null, async () => {
        const resp = await axiosInstance.get<{ ids: string[] }>('organizations/ids');
        return resp.data;
    });

    const { data, mutate } = useSWR(
        () => (taskPackageId != null ? `task-package/${taskPackageId}` : null),
        () => getTaskPackageById(taskPackageId ?? '')
    );

    const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([]);
    const [tasks, setTasks] = useState<TaskDraft[]>([]);
    const [deletedTaskIds, setDeletedTaskIds] = useState<string[]>([]);

    useEffect(() => {
        if (data != null) {
            setSelectedOrganizations(data.assignedOrganizationIds);
            setTasks(data.tasks);
        }
    }, [data]);

    useEffect(() => {
        if (isApplyAllOrganization && orgIds != null) {
            setSelectedOrganizations(orgIds.ids);
        } else if (!isApplyAllOrganization && data?.assignedOrganizationIds != null) {
            setSelectedOrganizations(data.assignedOrganizationIds);
        } else if (!isApplyAllOrganization) {
            setSelectedOrganizations([]);
        }
    }, [isApplyAllOrganization, orgIds, data?.assignedOrganizationIds]);

    const submit = async (_: TaskPackageFormState, formData: FormData): Promise<TaskPackageFormState> => {
        const data = {
            ...Object.fromEntries(formData.entries()),
            assignedOrganizationIds: selectedOrganizations,
            deletedTaskIds,
            tasks
        } as TaskPackageFormValues;
        const state = await action(data);

        if (state.isSuccess) {
            await mutate();
            if (taskPackageId == null) {
                setTasks([]);
            }
        }
        return state;
    };

    const handleOrganizationToggle = (organizationId: string) => {
        setSelectedOrganizations((prev) =>
            prev.includes(organizationId) ? prev.filter((id) => id !== organizationId) : [...prev, organizationId]
        );
    };

    const [state, dispatch] = useActionState(submit, { isSuccess: true });

    const { ref: incomingRef } = useIMask(
        {
            definitions: {
                0: /\d/
            },
            lazy: false,
            mask: '№ 000/000-00 от 00.00.0000',
            overwrite: true,
            placeholderChar: '_',
            radix: '.'
        },
        { defaultValue: data?.incomingRequisite }
    );

    const { ref: outgoingRef } = useIMask(
        {
            definitions: {
                0: /\d/
            },
            lazy: false,
            mask: '№ 000/000-00 от 00.00.0000',
            overwrite: true,
            placeholderChar: '_',
            radix: '.'
        },
        { defaultValue: data?.outgoingRequisite }
    );

    return (
        <Flex direction="column" gap="4" minHeight="100%" p="4">
            <Suspense fallback={<Loader />}>
                <form action={dispatch}>
                    <Flex asChild direction="column">
                        <DataList.Root size="2">
                            <DataList.Item>
                                <DataList.Label>Входящий реквизит</DataList.Label>
                                <DataList.Value>
                                    <Flex direction="column" width="100%">
                                        <TextField.Root
                                            name="incomingRequisite"
                                            placeholder="№ 154/549-54 от 26.03.2025"
                                            ref={incomingRef as Ref<HTMLInputElement>}
                                            style={{ width: '100%' }}
                                        />
                                        {state.incomingRequisite != null && (
                                            <Text color="red" size="1">
                                                {state.incomingRequisite}
                                            </Text>
                                        )}
                                    </Flex>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item align="center">
                                <DataList.Label>Исходящий реквизит</DataList.Label>
                                <DataList.Value>
                                    <Flex direction="column" width="100%">
                                        <TextField.Root
                                            name="outgoingRequisite"
                                            placeholder="№ 154/549-54 от 26.03.2025"
                                            ref={outgoingRef as Ref<HTMLInputElement>}
                                            style={{ width: '100%' }}
                                        />
                                        {state.outgoingRequisite != null && (
                                            <Text color="red" size="1">
                                                {state.outgoingRequisite}
                                            </Text>
                                        )}
                                    </Flex>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item align="center">
                                <DataList.Label>Прикрепляемые файлы</DataList.Label>
                                <DataList.Value>
                                    <FileUploader />
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item align="center">
                                <DataList.Label>Задачи</DataList.Label>
                                <DataList.Value>
                                    <Flex direction="column" gap="2" width="100%">
                                        <TaskDraftBrowser.Root
                                            data={tasks}
                                            deletedTaskIds={deletedTaskIds}
                                            setData={setTasks}
                                            setDeletedTaskIds={setDeletedTaskIds}
                                        >
                                            <Flex align="center" gap="2">
                                                <TaskDraftBrowser.CreateButton />
                                                <TaskDraftBrowser.NumberFilter />
                                                <TaskDraftBrowser.NameFilter />
                                            </Flex>
                                            <TaskDraftBrowser.DataList
                                                actions={(task) => (
                                                    <Flex align="center" gap="2" height="100%">
                                                        <TaskDraftBrowser.EditButton task={task} />
                                                        <TaskDraftBrowser.DeleteButton task={task} />
                                                    </Flex>
                                                )}
                                            />
                                        </TaskDraftBrowser.Root>
                                    </Flex>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item align="center">
                                <DataList.Label>Исполнители</DataList.Label>
                                <DataList.Value>
                                    <CheckboxGroup.Root
                                        name="assignedOrganizationIds"
                                        style={{ width: '100%' }}
                                        value={selectedOrganizations}
                                    >
                                        <Flex direction="column" gap="2" width="100%">
                                            <OrganizationBrowser.Root>
                                                <Flex gap="2">
                                                    <OrganizationBrowser.NameFilter />
                                                    <OrganizationBrowser.TypeFilter />
                                                    <OrganizationBrowser.ArchiveFilter />
                                                </Flex>
                                                <Suspense fallback={<Loader />}>
                                                    <OrganizationBrowser.DataTable
                                                        actionStart={{
                                                            title: (
                                                                <Checkbox
                                                                    checked={isApplyAllOrganization}
                                                                    onCheckedChange={(v) => {
                                                                        setIsApplyAllOrganization(Boolean(v));
                                                                    }}
                                                                />
                                                            ),
                                                            action: (organization) => (
                                                                <CheckboxGroup.Item
                                                                    onClick={() => {
                                                                        handleOrganizationToggle(organization.id);
                                                                    }}
                                                                    value={organization.id}
                                                                />
                                                            )
                                                        }}
                                                    />
                                                </Suspense>
                                            </OrganizationBrowser.Root>
                                        </Flex>
                                    </CheckboxGroup.Root>
                                </DataList.Value>
                            </DataList.Item>
                        </DataList.Root>
                    </Flex>

                    <Flex justify="end">
                        <Button type="submit">Сохранить</Button>
                    </Flex>
                </form>
            </Suspense>
        </Flex>
    );
}
