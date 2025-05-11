import { Flex, Strong, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { useActionState } from 'react';

import type { User, UserWithOrganization } from '~/entities/users';
import { deleteUser, useUsersWithOrganization } from '~/entities/users';

type DeleteUserFormState = {
    isSuccess: boolean;
    userId: string;
};

async function deleteUserAction({ userId }: DeleteUserFormState) {
    try {
        await deleteUser(userId);
        return { isSuccess: true, userId };
    } catch {
        return { isSuccess: false, userId };
    }
}

export function DeleteUserForm({ end, user }: { end?: ReactNode; user: User | UserWithOrganization }) {
    const { mutate } = useUsersWithOrganization();

    const action = async (prevState: DeleteUserFormState) => {
        const state = await deleteUserAction(prevState);
        if (state.isSuccess) await mutate();
        return state;
    };

    const [, dispatch] = useActionState(action, { isSuccess: false, userId: user.id });

    const userFullName = `${user.secondName} ${user.firstName} ${user.patronymic}`;

    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <Text>
                    Вы действительно хотите удалить пользователя: <Strong>{userFullName}</Strong>
                </Text>
                {end}
            </form>
        </Flex>
    );
}
