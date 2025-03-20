import { Pencil1Icon } from '@radix-ui/react-icons';
import { useId } from 'react';

import { type OrganizationType, OrganizationTypeForm } from '~/entities/organization-types';
import { DialogButton } from '~/shared/ui/dialog-button';

export type EditOrganizationTypeButtonProps = {
    organizationType: OrganizationType;
};

export function EditOrganizationTypeButton({ organizationType }: EditOrganizationTypeButtonProps) {
    const formId = useId();
    return (
        <DialogButton
            dialogTitle="Редактирование типа организации"
            formId={formId}
            icon={<Pencil1Icon />}
            tooltip="Редактировать тип организации"
        >
            <OrganizationTypeForm formId={formId} organizationType={organizationType} />
        </DialogButton>
    );
}
