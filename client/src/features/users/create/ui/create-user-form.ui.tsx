import type { ReactNode } from 'react';

import type { UserFormState } from '~/entities/users';
import { createUser, parseUserFormData, UserForm, useUsersWithOrganization } from '~/entities/users';
import { getFieldErrors } from '~/shared/api';

export async function createUserAction(_: UserFormState, formData: FormData): Promise<UserFormState> {
    const data = parseUserFormData(formData);

    try {
        await createUser(data);
        return { isSuccess: true };
    } catch (e) {
        return { ...getFieldErrors(e), isSuccess: false };
    }
}

export function CreateUserForm({ end, onSuccess }: { end?: ReactNode; onSuccess?: () => void }) {
    const { mutate } = useUsersWithOrganization();
    const action = async (prevState: UserFormState, formData: FormData) => {
        const state = await createUserAction(prevState, formData);
        if (state.isSuccess) {
            onSuccess?.();
            await mutate();
        }
        return state;
    };

    return <UserForm action={action} end={end} />;
}
