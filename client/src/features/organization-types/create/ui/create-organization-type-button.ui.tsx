import { PlusIcon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';
import { useState } from 'react';

import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog/index';

import { CreateOrganizationTypeForm } from './create-organization-type-form.ui';

export function CreateOrganizationTypeButton() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <UpsertEntityDialog.Root onOpenChange={setIsOpen} open={isOpen} title="Создание типа организации">
            <UpsertEntityDialog.Trigger
                onClick={() => {
                    setIsOpen(true);
                }}
                tooltip="Создать тип организации"
            >
                <PlusIcon />
            </UpsertEntityDialog.Trigger>
            <UpsertEntityDialog.Content>
                <Box asChild pr="3">
                    <ScrollArea size="1">
                        <CreateOrganizationTypeForm
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
