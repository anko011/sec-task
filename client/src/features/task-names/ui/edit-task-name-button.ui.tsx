import { Pencil1Icon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';

import { type TaskName, TaskNameForm, type TaskNameFormErrors, type TaskNameFormValues } from '~/entities/task-names';
import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';

export type EditTaskNameButtonProps = {
    taskName: TaskName;
    setIsOpen: (isOpen: boolean) => void;
    isOpen: boolean;
    action?: (values: TaskNameFormValues) => Promise<TaskNameFormErrors> | TaskNameFormErrors;
};

export function EditTaskNameButton({ taskName, action, isOpen, setIsOpen }: EditTaskNameButtonProps) {
    return (
        <UpsertEntityDialog.Root onOpenChange={setIsOpen} open={isOpen} title="Редактирование наименования">
            <UpsertEntityDialog.Trigger
                onClick={() => {
                    setIsOpen(true);
                }}
                tooltip="Редактировать наименование"
            >
                <Pencil1Icon />
            </UpsertEntityDialog.Trigger>
            <UpsertEntityDialog.Content>
                <Box asChild pr="3">
                    <ScrollArea size="1">
                        <TaskNameForm end={<UpsertEntityDialog.Controller />} action={action} taskName={taskName} />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
