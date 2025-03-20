import { PlusIcon } from '@radix-ui/react-icons';
import { useId } from 'react';

import { OrganizationForm } from '~/entities/organizations';
import { DialogButton } from '~/shared/ui/dialog-button';

export function CreateOrganizationButton() {
    const formId = useId();
    return (
        <DialogButton
            dialogTitle="Создание организации"
            formId={formId}
            icon={<PlusIcon />}
            tooltip="Создать организацию"
        >
            <OrganizationForm formId={formId} />
        </DialogButton>
    );
}
