import type { ReactNode } from 'react';

import type { Organization, OrganizationFormState } from '~/entities/organizations';
import { OrganizationForm, updateOrganization, useOrganizations } from '~/entities/organizations';
import { getFieldErrors } from '~/shared/api/query';

type EditOrganizationFormState = { organizationId: string } & OrganizationFormState;
type EditUserFormProps = { end?: ReactNode; onSuccess?: () => void; organization: Organization };

export async function editOrganizationAction(
    { organizationId }: EditOrganizationFormState,
    formData: FormData
): Promise<EditOrganizationFormState> {
    const typeId = formData.get('typeId');
    if (typeId === '-1') formData.delete('typeId');
    if (!formData.has('isArchived')) formData.set('isArchived', 'off');

    const data = Object.fromEntries(formData);
    try {
        await updateOrganization(organizationId, data);
        return { isSuccess: true, organizationId: organizationId };
    } catch (e) {
        return { ...getFieldErrors(e), isSuccess: false, organizationId: organizationId };
    }
}

export function EditOrganizationForm({ end, onSuccess, organization }: EditUserFormProps) {
    const { mutate } = useOrganizations();
    const action = async (prevState: OrganizationFormState, formData: FormData) => {
        const state = await editOrganizationAction({ organizationId: organization.id, ...prevState }, formData);
        if (state.isSuccess) {
            onSuccess?.();
            await mutate();
        }
        return state;
    };

    return <OrganizationForm action={action} end={end} organization={organization} />;
}
