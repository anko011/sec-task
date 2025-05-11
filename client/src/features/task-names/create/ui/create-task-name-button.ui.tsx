import { PlusIcon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';
import { useState } from 'react';

import { CreateTaskNameForm } from '~/features/task-names/create/ui/create-task-name-form.ui';
import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog/index';

export function CreateTaskNameButton() {
    const [isOpen, setIsOpen] = useState(false);

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
                        <CreateTaskNameForm
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
