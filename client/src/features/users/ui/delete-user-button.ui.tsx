import { Flex, Strong, Text } from '@radix-ui/themes';

import type { User, UserWithOrganization } from '~/entities/users';
import { DeleteEntityDialog } from '~/shared/ui/delete-entity-dialog';

export type DeleteUserButtonProps = {
    user: User | UserWithOrganization;
    action?: () => Promise<void> | void;
};

export function DeleteUserButton({ user, action }: DeleteUserButtonProps) {
    const userFullName = `${user.secondName} ${user.firstName} ${user.patronymic}`;
    return (
        <DeleteEntityDialog.Root confirmation={user.email} title="Удаление пользователя">
            <DeleteEntityDialog.Trigger tooltip="Удалить пользователя" />
            <DeleteEntityDialog.Content>
                <Flex asChild direction="column" gap="2">
                    <form action={action}>
                        <Text>
                            Вы действительно хотите удалить пользователя: <Strong>{userFullName}</Strong>
                        </Text>
                        <Text>
                            Для удаления введите: <Strong>{user.email}</Strong>
                        </Text>
                        <DeleteEntityDialog.ConfirmationField />
                        <DeleteEntityDialog.Controller />
                    </form>
                </Flex>
            </DeleteEntityDialog.Content>
        </DeleteEntityDialog.Root>
    );
}
