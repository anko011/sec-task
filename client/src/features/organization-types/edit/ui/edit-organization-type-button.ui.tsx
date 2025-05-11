import { Pencil1Icon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';
import { useState } from 'react';
import { useSWRConfig } from 'swr';

import type { OrganizationType } from '~/entities/organization-types';
import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog/index';

import { EditOrganizationTypeForm } from './edit-organization-type-form.ui';

type EditOrganizationTypeButtonProps = {
    organizationType: OrganizationType;
};

export function EditOrganizationTypeButton({ organizationType }: EditOrganizationTypeButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <UpsertEntityDialog.Root onOpenChange={setIsOpen} open={isOpen} title="Редактирование типа организации">
            <UpsertEntityDialog.Trigger
                onClick={() => {
                    setIsOpen(true);
                }}
                tooltip="Редактировать тип организации"
            >
                <Pencil1Icon />
            </UpsertEntityDialog.Trigger>
            <UpsertEntityDialog.Content>
                <Box asChild pr="3">
                    <ScrollArea size="1">
                        <EditOrganizationTypeForm
                            end={<UpsertEntityDialog.Controller />}
                            onSuccess={() => {
                                setIsOpen(false);
                            }}
                            organizationType={organizationType}
                        />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
