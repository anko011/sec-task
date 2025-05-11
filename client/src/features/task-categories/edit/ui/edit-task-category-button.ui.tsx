import { Pencil1Icon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';
import { useState } from 'react';

import type { TaskCategory } from '~/entities/task-categories';
import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';

import { EditTaskCategoryForm } from './edit-task-category-form.ui';

export type EditTaskCategoryButtonProps = {
    taskCategory: TaskCategory;
};

export function EditTaskCategoryButton({ taskCategory }: EditTaskCategoryButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
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
                        <EditTaskCategoryForm
                            end={<UpsertEntityDialog.Controller />}
                            onSuccess={() => {
                                setIsOpen(false);
                            }}
                            taskCategory={taskCategory}
                        />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
