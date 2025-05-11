import { Pencil1Icon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';
import { useState } from 'react';

import type { TaskName } from '~/entities/task-names';
import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';

import { EditTaskNameForm } from './edit-task-name-form.ui';

export type EditTaskNameButtonProps = {
    taskName: TaskName;
};

export function EditTaskNameButton({ taskName }: EditTaskNameButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
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
                        <EditTaskNameForm
                            end={<UpsertEntityDialog.Controller />}
                            onSuccess={() => {
                                setIsOpen(false);
                            }}
                            taskName={taskName}
                        />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
