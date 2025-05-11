import type { ReactNode } from 'react';

import type { OrganizationFormState } from '~/entities/organizations';
import { OrganizationForm, useOrganizations } from '~/entities/organizations';
import { createOrganization } from '~/entities/organizations/api';
import { getFieldErrors } from '~/shared/api';

export async function createOrganizationAction(
    _: OrganizationFormState,
    formData: FormData
): Promise<OrganizationFormState> {
    const typeId = formData.get('typeId');
    if (typeId === '-1') formData.delete('typeId');

    const data = Object.fromEntries(formData);

    try {
        await createOrganization(data);
        return { isSuccess: true };
    } catch (e) {
        return { ...getFieldErrors(e), isSuccess: false };
    }
}

export function CreateOrganizationForm({ end, onSuccess }: { end?: ReactNode; onSuccess?: () => void }) {
    const { mutate } = useOrganizations();
    const action = async (prevState: OrganizationFormState, formData: FormData) => {
        const state = await createOrganizationAction(prevState, formData);
        if (state.isSuccess) {
            onSuccess?.();
            await mutate();
        }
        return state;
    };

    return <OrganizationForm action={action} end={end} />;
}
