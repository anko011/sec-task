import { PlusIcon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';

import { OrganizationForm, type OrganizationFormErrors, type OrganizationFormValues } from '~/entities/organizations';
import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';

export type CreateOrganizationButtonProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    action?: (values: OrganizationFormValues) => Promise<OrganizationFormErrors> | OrganizationFormErrors;
};

export function CreateOrganizationButton({ action, isOpen, setIsOpen }: CreateOrganizationButtonProps) {
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
                        <OrganizationForm end={<UpsertEntityDialog.Controller />} action={action} />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
