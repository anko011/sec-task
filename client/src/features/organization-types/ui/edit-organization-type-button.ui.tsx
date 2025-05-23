import { Pencil1Icon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';

import {
    type OrganizationType,
    OrganizationTypeForm,
    type OrganizationTypeFormErrors,
    type OrganizationTypeFormValues
} from '~/entities/organization-types';

import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';

export type EditOrganizationTypeButtonProps = {
    organizationType: OrganizationType;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    action?: (values: OrganizationTypeFormValues) => Promise<OrganizationTypeFormErrors> | OrganizationTypeFormErrors;
};

export function EditOrganizationTypeButton({
    organizationType,
    setIsOpen,
    isOpen,
    action
}: EditOrganizationTypeButtonProps) {
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
                        <OrganizationTypeForm
                            end={<UpsertEntityDialog.Controller />}
                            action={action}
                            organizationType={organizationType}
                        />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
