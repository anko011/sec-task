import { Pencil1Icon } from '@radix-ui/react-icons';
import { useId } from 'react';

import { type Organization, OrganizationForm } from '~/entities/organizations';
import { DialogButton } from '~/shared/ui/dialog-button';

export type EditOrganizationButtonProps = {
    organization: Organization;
};

export function EditOrganizationButton({ organization }: EditOrganizationButtonProps) {
    const formId = useId();
    return (
        <DialogButton
            dialogTitle="Редактировать сотрудника"
            formId={formId}
            icon={<Pencil1Icon />}
            tooltip="Редактирование сотрудника"
        >
            <OrganizationForm formId={formId} organization={organization} />
        </DialogButton>
    );
}
