import { Strong, Text } from '@radix-ui/themes';

import type { User, UserWithOrganization } from '~/entities/users';
import { DeleteUserForm } from '~/features/users/delete/ui/delete-user-form.ui';
import { DeleteEntityDialog } from '~/shared/ui/delete-entity-dialog';

export type DeleteUserButtonProps = {
    user: User | UserWithOrganization;
};

export function DeleteUserButton({ user }: DeleteUserButtonProps) {
    return (
        <DeleteEntityDialog.Root confirmation={user.email} title="Удаление пользователя">
            <DeleteEntityDialog.Trigger tooltip="Удалить пользователя" />
            <DeleteEntityDialog.Content>
                <DeleteUserForm
                    end={
                        <>
                            <Text>
                                Для удаления введите: <Strong>{user.email}</Strong>
                            </Text>
                            <DeleteEntityDialog.ConfirmationField />
                            <DeleteEntityDialog.Controller />
                        </>
                    }
                    user={user}
                />
            </DeleteEntityDialog.Content>
        </DeleteEntityDialog.Root>
    );
}
