import { Pencil1Icon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';
import { useState } from 'react';

import type { Organization } from '~/entities/organizations';
import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';

import { EditOrganizationForm } from './edit-organization-form.ui';

export type EditOrganizationButtonProps = {
    organization: Organization;
};

export function EditOrganizationButton({ organization }: EditOrganizationButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <UpsertEntityDialog.Root onOpenChange={setIsOpen} open={isOpen} title="Редактирование организации">
            <UpsertEntityDialog.Trigger
                onClick={() => {
                    setIsOpen(true);
                }}
                tooltip="Редактировать организацию"
            >
                <Pencil1Icon />
            </UpsertEntityDialog.Trigger>
            <UpsertEntityDialog.Content>
                <Box asChild pr="3">
                    <ScrollArea size="1">
                        <EditOrganizationForm
                            end={<UpsertEntityDialog.Controller />}
                            onSuccess={() => {
                                setIsOpen(false);
                            }}
                            organization={organization}
                        />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
