import { Pencil1Icon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';

import {
    type TaskCategory,
    TaskCategoryForm,
    type TaskCategoryFormErrors,
    type TaskCategoryFormValues
} from '~/entities/task-categories';

import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';

export type EditTaskCategoryButtonProps = {
    taskCategory: TaskCategory;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    action?: (values: TaskCategoryFormValues) => Promise<TaskCategoryFormErrors> | TaskCategoryFormErrors;
};

export function EditTaskCategoryButton({ taskCategory, action, isOpen, setIsOpen }: EditTaskCategoryButtonProps) {
    return (
        <UpsertEntityDialog.Root onOpenChange={setIsOpen} open={isOpen} title="Редактирование категории">
            <UpsertEntityDialog.Trigger
                onClick={() => {
                    setIsOpen(true);
                }}
                tooltip="Редактировать категори"
            >
                <Pencil1Icon />
            </UpsertEntityDialog.Trigger>
            <UpsertEntityDialog.Content>
                <Box asChild pr="3">
                    <ScrollArea size="1">
                        <TaskCategoryForm
                            end={<UpsertEntityDialog.Controller />}
                            action={action}
                            taskCategory={taskCategory}
                        />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
