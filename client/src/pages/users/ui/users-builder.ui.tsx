import { useState } from 'react';
import { toast } from 'react-toastify';
import { takeFirstElements, useStrictContext } from '~/shared/lib';

import { CreateUserButton, DeleteUserButton, EditUserButton } from '~/features/users/';

import {
    CreateUserContract,
    EditUserContract,
    useCurrentUser,
    type User,
    type UserFormErrors,
    type UserFormValues,
    UsersView,
    UsersViewContext,
    type UserWithOrganization
} from '~/entities/users';
import { getFieldErrors } from '~/shared/api';

function Delete({ user }: { user: User | UserWithOrganization }) {
    const { remove } = useStrictContext(UsersViewContext);

    const { user: currentUser } = useCurrentUser();
    if (user.id === currentUser?.id) return null;

    const handleDelete = async () => {
        try {
            await remove(user.id);
            toast.success(`Пользователь ${user.email} успешно удален`);
        } catch {
            toast.error('Не удалось удалить пользователя');
        }
    };

    return <DeleteUserButton user={user} action={handleDelete} />;
}

function Create() {
    const { create } = useStrictContext(UsersViewContext);
    const [isOpen, setIsOpen] = useState(false);

    const action = async (values: UserFormValues): Promise<UserFormErrors> => {
        const validation = CreateUserContract.safeParse(values);

        if (!validation.success) {
            return takeFirstElements(validation.error.flatten().fieldErrors);
        }
        try {
            await create(validation.data);
            toast.success('Пользователь успешно создан');
            setIsOpen(false);
            return {};
        } catch (error) {
            return getFieldErrors(error);
        }
    };
    return <CreateUserButton action={action} setIsOpen={setIsOpen} isOpen={isOpen} />;
}

function Edit({ user }: { user: User | UserWithOrganization }) {
    const [isOpen, setIsOpen] = useState(false);
    const { edit } = useStrictContext(UsersViewContext);

    const { user: currentUser } = useCurrentUser();
    if (user.id === currentUser?.id) return null;

    const action = async (values: UserFormValues): Promise<UserFormErrors> => {
        const validation = EditUserContract.safeParse(values);
        if (!validation.success) {
            return takeFirstElements(validation.error.flatten().fieldErrors);
        }
        try {
            await edit(user.id, validation.data);
            toast.success('Пользователь успешно отредактирован');
            setIsOpen(false);
            return {};
        } catch (error) {
            return getFieldErrors(error);
        }
    };
    return <EditUserButton user={user} isOpen={isOpen} setIsOpen={setIsOpen} action={action} />;
}

export const UsersBuilder = {
    ...UsersView,
    Delete,
    Create,
    Edit
};
