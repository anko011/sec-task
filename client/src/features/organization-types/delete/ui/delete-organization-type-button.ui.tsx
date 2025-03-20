import { TrashIcon } from '@radix-ui/react-icons';

import type { OrganizationType } from '~/entities/organization-types';
import { AlertDialogButton } from '~/shared/ui/alert-dialog-button';

export type DeleteOrganizationTypeButtonProps = {
    organizationType: OrganizationType;
};

export function DeleteOrganizationTypeButton({ organizationType }: DeleteOrganizationTypeButtonProps) {
    return (
        <AlertDialogButton
            color="red"
            dialogTitle="Удаление типа организации"
            icon={<TrashIcon />}
            tooltip="Удалить тип организации"
        >
            Вы действительно хотите удалить тип организации "{organizationType.name}"?
        </AlertDialogButton>
    );
}
