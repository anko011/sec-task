import { Pencil1Icon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';

import {
    type Organization,
    OrganizationForm,
    type OrganizationFormErrors,
    type OrganizationFormValues
} from '~/entities/organizations';
import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';

export type EditOrganizationButtonProps = {
    organization: Organization;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    action?: (values: OrganizationFormValues) => Promise<OrganizationFormErrors> | OrganizationFormErrors;
};

export function EditOrganizationButton({ organization, action, isOpen, setIsOpen }: EditOrganizationButtonProps) {
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
                        <OrganizationForm
                            end={<UpsertEntityDialog.Controller />}
                            action={action}
                            organization={organization}
                        />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
