import { PlusIcon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';

import {
    OrganizationTypeForm,
    type OrganizationTypeFormErrors,
    type OrganizationTypeFormValues
} from '~/entities/organization-types';
import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';

export type CreateOrganizationTypeButtonProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    action?: (values: OrganizationTypeFormValues) => Promise<OrganizationTypeFormErrors> | OrganizationTypeFormErrors;
};

export function CreateOrganizationTypeButton({ action, isOpen, setIsOpen }: CreateOrganizationTypeButtonProps) {
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
                        <OrganizationTypeForm end={<UpsertEntityDialog.Controller />} action={action} />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
