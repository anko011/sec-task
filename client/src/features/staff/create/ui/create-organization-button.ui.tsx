import { PlusIcon } from '@radix-ui/react-icons';
import { useId } from 'react';

import { OrganizationForm } from '~/entities/organizations';
import { DialogButton } from '~/shared/ui/dialog-button';

export function CreateOrganizationButton() {
    const formId = useId();
    return (
        <DialogButton
            dialogTitle="Создание сотрудника"
            formId={formId}
            icon={<PlusIcon />}
            tooltip="Создать сотрудника"
        >
            <OrganizationForm formId={formId} />
        </DialogButton>
    );
}
