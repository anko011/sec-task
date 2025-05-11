import type { ReactNode } from 'react';

import type { User, UserFormState, UserWithOrganization } from '~/entities/users';
import { parseUserFormData, updateUser, UserForm, useUsersWithOrganization } from '~/entities/users';
import { getFieldErrors } from '~/shared/api/query';

type EditFormState = { userId: string } & UserFormState;

export async function editUserAction({ userId }: EditFormState, formData: FormData): Promise<EditFormState> {
    const data = parseUserFormData(formData);

    try {
        await updateUser(userId, data);
        return { isSuccess: true, userId };
    } catch (e) {
        return { ...getFieldErrors(e), isSuccess: false, userId };
    }
}

type EditUserFormProps = { end?: ReactNode; onSuccess?: () => void; user: User | UserWithOrganization };

export function EditUserForm({ end, onSuccess, user }: EditUserFormProps) {
    const { mutate } = useUsersWithOrganization();

    const action = async (prevState: UserFormState, formData: FormData) => {
        const state = await editUserAction({ userId: user.id, ...prevState }, formData);
        if (state.isSuccess) {
            onSuccess?.();
            await mutate();
        }
        return state;
    };

    return <UserForm action={action} end={end} user={user} />;
}
