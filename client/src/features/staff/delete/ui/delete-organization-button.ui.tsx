import { TrashIcon } from '@radix-ui/react-icons';

import type { Organization } from '~/entities/organizations';
import { AlertDialogButton } from '~/shared/ui/alert-dialog-button';

export type DeleteOrganizationButtonProps = {
    organization: Organization;
};

export function DeleteOrganizationButton({ organization }: DeleteOrganizationButtonProps) {
    return (
        <AlertDialogButton
            color="red"
            dialogTitle="Удаление сотрудника"
            icon={<TrashIcon />}
            tooltip="Удалить сотрудника"
        >
            Вы действительно хотите удалить организацию "{organization.name}"?
        </AlertDialogButton>
    );
}
