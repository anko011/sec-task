import { PlusIcon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';
import { useState } from 'react';

import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';

import { CreateTaskCategoryForm } from './create-task-category-form.ui';

export function CreateTaskCategoryButton() {
    const [isOpen, setIsOpen] = useState(false);

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
                        <CreateTaskCategoryForm
                            end={<UpsertEntityDialog.Controller />}
                            onSuccess={() => {
                                setIsOpen(false);
                            }}
                        />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
