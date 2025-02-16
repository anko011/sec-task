import { PlusIcon } from '@radix-ui/react-icons';
import { useId } from 'react';

import { OrganizationTypeForm } from '~/entities/organization-types';
import { DialogButton } from '~/shared/ui/dialog-button';

export function CreateOrganizationTypeButton() {
    const formId = useId();
    return (
        <DialogButton
            dialogTitle="Создание типа организации"
            formId={formId}
            icon={<PlusIcon />}
            tooltip="Создать тип организации"
        >
            <OrganizationTypeForm formId={formId} />
        </DialogButton>
    );
}
