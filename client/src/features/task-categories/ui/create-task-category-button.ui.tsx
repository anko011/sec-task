import { PlusIcon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';

import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';
import { TaskCategoryForm, type TaskCategoryFormErrors, type TaskCategoryFormValues } from '~/entities/task-categories';

export type CreateTaskCategoryButtonProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    action?: (values: TaskCategoryFormValues) => Promise<TaskCategoryFormErrors> | TaskCategoryFormErrors;
};

export function CreateTaskCategoryButton({ action, isOpen, setIsOpen }: CreateTaskCategoryButtonProps) {
    return (
        <UpsertEntityDialog.Root onOpenChange={setIsOpen} open={isOpen} title="Создание категории">
            <UpsertEntityDialog.Trigger
                onClick={() => {
                    setIsOpen(true);
                }}
                tooltip="Создать категорию"
            >
                <PlusIcon />
            </UpsertEntityDialog.Trigger>
            <UpsertEntityDialog.Content>
                <Box asChild pr="3">
                    <ScrollArea size="1">
                        <TaskCategoryForm action={action} end={<UpsertEntityDialog.Controller />} />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
