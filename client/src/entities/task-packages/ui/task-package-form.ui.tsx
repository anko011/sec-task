import { useActionState, useState } from 'react';
import { Button, DataList, Flex } from '@radix-ui/themes';

import { type Task, type TaskDraft, TaskDraftBuilder } from '~/entities/tasks';
import { OrganizationsTableSelector } from '~/entities/organizations';
import { FormField } from '~/shared/ui/form-field';
import { ClearableTextField } from '~/shared/ui/clearable-text-field';
import { FileUploader } from '~/shared/ui/file-uploader';

import type { TaskPackage } from '../model/task-package';
import { useRequisiteMask } from '../lib/use-requsite-mask';
import type { Attachment } from '../model/attachment';

export type TaskPackageFormErrors = {
    incomingRequisite?: string;
    outgoingRequisite?: string;
};

export type TaskPackageFormValues = {
    incomingRequisiteMasked?: string;
    incomingRequisiteUnmasked?: string;
    outgoingRequisiteMasked?: string;
    outgoingRequisiteUnmasked?: string;
    assignedOrganizationIds?: string[];
    tasks: TaskDraft[];
    attachments: Attachment[];
    filesToUpload: File[];
};

export type TaskPackageFormProps = {
    action?: (data: TaskPackageFormValues) => Promise<TaskPackageFormErrors>;
    taskPackage?: Omit<TaskPackage, 'tasks'> & { tasks: Task[] };
};

export function TaskPackageForm({ action, taskPackage }: TaskPackageFormProps) {
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const [attachments, setAttachments] = useState<Attachment[]>(taskPackage?.attachments ?? []);

    const [assignedOrganizationIds, setAssignedOrganizationIds] = useState<string[]>(taskPackage?.organizations ?? []);
    const [taskDrafts, setTaskDrafts] = useState<TaskDraft[]>(taskPackage?.tasks ?? []);

    const {
        ref: incomingRef,
        setUnmaskedValue: setIncomingRequisite,
        value: incomingRequisiteMasked,
        unmaskedValue: incomingRequisiteUnmasked
    } = useRequisiteMask({ defaultValue: taskPackage?.incomingRequisite });

    const {
        ref: outgoingRef,
        setUnmaskedValue: setOutgoingRequisite,
        value: outgoingRequisiteMasked,
        unmaskedValue: outgoingRequisiteUnmasked
    } = useRequisiteMask({ defaultValue: taskPackage?.outgoingRequisite });

    const submit = async (_: TaskPackageFormErrors): Promise<TaskPackageFormErrors> => {
        if (!action) return _;
        return await action({
            incomingRequisiteMasked: incomingRequisiteMasked,
            incomingRequisiteUnmasked: incomingRequisiteUnmasked,
            outgoingRequisiteMasked: outgoingRequisiteMasked,
            outgoingRequisiteUnmasked: outgoingRequisiteUnmasked,
            tasks: taskDrafts,
            assignedOrganizationIds,
            filesToUpload,
            attachments
        });
    };

    const [errors, dispatch, pending] = useActionState(submit, {});

    return (
        <Flex direction="column" gap="4" minHeight="100%" p="4">
            <form action={dispatch}>
                <Flex asChild direction="column">
                    <DataList.Root size="2">
                        <DataList.Item>
                            <DataList.Label>Входящий реквизит</DataList.Label>
                            <DataList.Value>
                                <FormField error={errors.incomingRequisite}>
                                    <ClearableTextField
                                        name="incomingRequisite"
                                        placeholder="№ 154/549-54 от 26.03.2025"
                                        ref={incomingRef}
                                        style={{ width: '100%' }}
                                        onClear={() => {
                                            setIncomingRequisite('');
                                        }}
                                    />
                                </FormField>
                            </DataList.Value>
                        </DataList.Item>

                        <DataList.Item align="center">
                            <DataList.Label>Исходящий реквизит</DataList.Label>
                            <DataList.Value>
                                <FormField error={errors.outgoingRequisite}>
                                    <ClearableTextField
                                        name="outgoingRequisite"
                                        placeholder="№ 154/549-54 от 26.03.2025"
                                        ref={outgoingRef}
                                        style={{ width: '100%' }}
                                        onClear={() => {
                                            setOutgoingRequisite('');
                                        }}
                                    />
                                </FormField>
                            </DataList.Value>
                        </DataList.Item>

                        <DataList.Item align="center">
                            <DataList.Label>Прикрепляемые файлы</DataList.Label>
                            <DataList.Value>
                                <Flex direction="column" gap="2" width="100%">
                                    <FileUploader
                                        files={[...filesToUpload, ...attachments]}
                                        onFilesUpload={setFilesToUpload}
                                        onUpdateAttachments={setAttachments}
                                    />
                                </Flex>
                            </DataList.Value>
                        </DataList.Item>

                        <DataList.Item align="center">
                            <DataList.Label>Задачи</DataList.Label>
                            <DataList.Value>
                                <Flex direction="column" gap="2" width="100%">
                                    <TaskDraftBuilder.Root setTaskDrafts={setTaskDrafts} taskDrafts={taskDrafts}>
                                        <Flex gap="2" align="center" width="30%">
                                            <TaskDraftBuilder.Create />
                                            <TaskDraftBuilder.NumberFilter />
                                            <TaskDraftBuilder.CategoryFilter />
                                            <TaskDraftBuilder.DangerStatusFilter />
                                        </Flex>
                                        <TaskDraftBuilder.DataList
                                            actions={(taskDraft) => (
                                                <Flex gap="2">
                                                    <TaskDraftBuilder.Edit taskDraft={taskDraft} />
                                                    <TaskDraftBuilder.Delete taskDraft={taskDraft} />
                                                </Flex>
                                            )}
                                        />
                                    </TaskDraftBuilder.Root>
                                </Flex>
                            </DataList.Value>
                        </DataList.Item>

                        <DataList.Item align="center">
                            <DataList.Label>Исполнители</DataList.Label>
                            <DataList.Value>
                                <OrganizationsTableSelector
                                    organizationIds={assignedOrganizationIds}
                                    setOrganizationIds={setAssignedOrganizationIds}
                                />
                            </DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                </Flex>

                <Flex justify="end">
                    <Button type="submit" loading={pending}>
                        Сохранить
                    </Button>
                </Flex>
            </form>
        </Flex>
    );
}
