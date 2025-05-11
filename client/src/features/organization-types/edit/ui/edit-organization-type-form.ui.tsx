import type { ReactNode } from 'react';
import React from 'react';

import type { OrganizationType, OrganizationTypeFormState } from '~/entities/organization-types';
import { OrganizationTypeForm, updateOrganizationType, useOrganizationTypes } from '~/entities/organization-types';
import { getFieldErrors } from '~/shared/api';

type EditOrganizationTypeForm = { end?: ReactNode; onSuccess?: () => void; organizationType: OrganizationType };
type EditOrganizationTypeFormState = OrganizationTypeFormState & { organizationTypeId: string };

async function editOrganizationTypeAction(
    { organizationTypeId }: EditOrganizationTypeFormState,
    formData: FormData
): Promise<EditOrganizationTypeFormState> {
    const data = Object.fromEntries(formData);

    try {
        await updateOrganizationType(organizationTypeId, data);
        return { isSuccess: true, organizationTypeId };
    } catch (e) {
        return { ...getFieldErrors(e), isSuccess: false, organizationTypeId };
    }
}

export function EditOrganizationTypeForm({ end, onSuccess, organizationType }: EditOrganizationTypeForm) {
    const { mutate } = useOrganizationTypes();

    const action = async (
        prevState: OrganizationTypeFormState,
        formData: FormData
    ): Promise<OrganizationTypeFormState> => {
        const state = await editOrganizationTypeAction(
            {
                ...prevState,
                organizationTypeId: organizationType.id
            },
            formData
        );
        if (state.isSuccess) {
            onSuccess?.();
            await mutate();
        }
        return state;
    };

    return <OrganizationTypeForm action={action} end={end} organizationType={organizationType} />;
}
