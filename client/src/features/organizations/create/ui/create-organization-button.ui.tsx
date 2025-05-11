import { PlusIcon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';
import { useState } from 'react';

import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog/index';

import { CreateOrganizationForm } from './create-organization-form.ui';

export function CreateOrganizationButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <UpsertEntityDialog.Root onOpenChange={setIsOpen} open={isOpen} title="Создание организации">
            <UpsertEntityDialog.Trigger
                onClick={() => {
                    setIsOpen(true);
                }}
                tooltip="Создать организацию"
            >
                <PlusIcon />
            </UpsertEntityDialog.Trigger>
            <UpsertEntityDialog.Content>
                <Box asChild pr="3">
                    <ScrollArea size="1">
                        <CreateOrganizationForm
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
