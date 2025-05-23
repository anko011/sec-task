import { TaskStatus } from '~/entities/tasks';
import { useContext, useState } from 'react';
import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog/index';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import {
    ChangeTaskStatusForm,
    type ChangeTaskStatusFormErrors,
    type ChangeTaskStatusFormValues
} from './change-task-status-form.ui';
import { z } from 'zod';
import { takeFirstElements, useStrictContext } from '~/shared/lib';
import { TaskExecutionHistoryContext } from './task-status-history-list.ui';
import { TaskExecutionContext, TaskExecutionsContext } from './task-executions-accordion-by-organizations.ui';
import { axiosInstance } from '~/shared/api';
import { TasksViewContext } from './tasks-view.ui';

const ChangeTaskStatusContract = z.object({
    status: z.nativeEnum(TaskStatus),
    comment: z.string().nonempty()
});

export function ChangeTaskStatusButton({ packageId, taskId }: { packageId: string; taskId: string }) {
    const execution = useStrictContext(TaskExecutionContext);
    const histories = useContext(TaskExecutionHistoryContext);
    const executions = useContext(TaskExecutionsContext);
    const tasks = useContext(TasksViewContext);

    const [isOpen, setIsOpen] = useState(false);

    const action = async (values: ChangeTaskStatusFormValues): Promise<ChangeTaskStatusFormErrors> => {
        const validation = ChangeTaskStatusContract.safeParse(values);
        if (validation.success) {
            await axiosInstance.post(
                `/task-packages/${packageId}/tasks/${taskId}/organization/${execution.data?.organization.id}/change-status`,
                validation.data
            );

            await Promise.all([histories?.mutate(), executions?.mutate(), tasks?.mutate(), execution.mutate()]);

            setIsOpen(false);
        }
        return takeFirstElements({ ...validation.error?.flatten().fieldErrors });
    };

    return (
        <UpsertEntityDialog.Root onOpenChange={setIsOpen} open={isOpen} title="Смена статуса">
            <UpsertEntityDialog.Trigger tooltip="Изменить статус">
                <PaperPlaneIcon />
            </UpsertEntityDialog.Trigger>
            <UpsertEntityDialog.Content minHeight="50vh">
                <ChangeTaskStatusForm
                    end={<UpsertEntityDialog.Controller />}
                    currentStatus={execution?.data?.lastStatus ?? TaskStatus.NEW}
                    action={action}
                />
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
