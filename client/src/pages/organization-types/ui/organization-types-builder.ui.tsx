import { useState } from 'react';
import { toast } from 'react-toastify';

import {
    CreateOrganizationTypeButton,
    DeleteOrganizationTypeButton,
    EditOrganizationTypeButton
} from '~/features/organization-types';

import {
    CreateOrganizationTypeContract,
    EditOrganizationTypeContract,
    type OrganizationType,
    type OrganizationTypeFormErrors,
    type OrganizationTypeFormValues,
    OrganizationTypesView,
    OrganizationTypesViewContext
} from '~/entities/organization-types';

import { takeFirstElements, useStrictContext } from '~/shared/lib';

function Delete({ organizationType }: { organizationType: OrganizationType }) {
    const { remove } = useStrictContext(OrganizationTypesViewContext);

    const action = async () => {
        await remove(organizationType.id);
        toast.success(`Тип организации ${organizationType.title} успешно удален`);
    };
    return <DeleteOrganizationTypeButton organizationType={organizationType} action={action} />;
}

function Edit({ organizationType }: { organizationType: OrganizationType }) {
    const [isOpen, setIsOpen] = useState(false);
    const { edit } = useStrictContext(OrganizationTypesViewContext);

    const action = async (values: OrganizationTypeFormValues): Promise<OrganizationTypeFormErrors> => {
        const validation = EditOrganizationTypeContract.safeParse(values);
        if (validation.success) {
            await edit(organizationType.id, validation.data);
            toast.success('Тип организации успешно отредактирован');
            setIsOpen(false);
            return {};
        }

        return takeFirstElements(validation.error.flatten().fieldErrors);
    };
    return (
        <EditOrganizationTypeButton
            action={action}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            organizationType={organizationType}
        />
    );
}

function Create() {
    const { create } = useStrictContext(OrganizationTypesViewContext);
    const [isOpen, setIsOpen] = useState(false);

    const action = async (values: OrganizationTypeFormValues): Promise<OrganizationTypeFormErrors> => {
        const validation = CreateOrganizationTypeContract.safeParse(values);
        if (validation.success) {
            await create(validation.data);
            toast.success('Тип организации успешно создан');
            setIsOpen(false);
            return {};
        }
        return takeFirstElements(validation.error.flatten().fieldErrors);
    };
    return <CreateOrganizationTypeButton setIsOpen={setIsOpen} isOpen={isOpen} action={action} />;
}

export const OrganizationTypesBuilder = { ...OrganizationTypesView, Create, Delete, Edit };
