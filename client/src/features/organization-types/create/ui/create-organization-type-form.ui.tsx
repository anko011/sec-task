import type { ReactNode } from 'react';

import type { OrganizationTypeFormState } from '~/entities/organization-types';
import { createOrganizationType, OrganizationTypeForm, useOrganizationTypes } from '~/entities/organization-types';
import { getFieldErrors } from '~/shared/api';

async function createOrganizationTypeAction(
    _: OrganizationTypeFormState,
    formData: FormData
): Promise<OrganizationTypeFormState> {
    const data = Object.fromEntries(formData);

    try {
        await createOrganizationType(data);
        return { isSuccess: true };
    } catch (e) {
        return { ...getFieldErrors(e), isSuccess: false };
    }
}

export function CreateOrganizationTypeForm({ end, onSuccess }: { end?: ReactNode; onSuccess?: () => void }) {
    const { mutate } = useOrganizationTypes();

    const action = async (
        prevState: OrganizationTypeFormState,
        formData: FormData
    ): Promise<OrganizationTypeFormState> => {
        const state = await createOrganizationTypeAction(prevState, formData);
        if (state.isSuccess) {
            onSuccess?.();
            await mutate();
        }
        return state;
    };

    return <OrganizationTypeForm action={action} end={end} />;
}
