import { PlusIcon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';

import { TaskNameForm, type TaskNameFormErrors, type TaskNameFormValues } from '~/entities/task-names';
import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';

export type CreateTaskNameButtonProps = {
    action: (value: TaskNameFormValues) => Promise<TaskNameFormErrors>;
    setIsOpen: (isOpen: boolean) => void;
    isOpen: boolean;
};

export function CreateTaskNameButton({ action, isOpen, setIsOpen }: CreateTaskNameButtonProps) {
    return (
        <UpsertEntityDialog.Root onOpenChange={setIsOpen} open={isOpen} title="Создание наименования">
            <UpsertEntityDialog.Trigger
                onClick={() => {
                    setIsOpen(true);
                }}
                tooltip="Создать наименование"
            >
                <PlusIcon />
            </UpsertEntityDialog.Trigger>
            <UpsertEntityDialog.Content>
                <Box asChild pr="3">
                    <ScrollArea size="1">
                        <TaskNameForm end={<UpsertEntityDialog.Controller />} action={action} />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
