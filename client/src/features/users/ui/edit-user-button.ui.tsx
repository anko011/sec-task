import { Pencil1Icon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';

import {
    type User,
    UserForm,
    type UserFormErrors,
    type UserFormValues,
    type UserWithOrganization
} from '~/entities/users';

import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';

export type EditUserButtonProps = {
    user: User | UserWithOrganization;
    setIsOpen: (isOpen: boolean) => void;
    isOpen: boolean;
    action?: (values: UserFormValues) => Promise<UserFormErrors> | UserFormErrors;
};

export function EditUserButton({ user, action, isOpen, setIsOpen }: EditUserButtonProps) {
    return (
        <UpsertEntityDialog.Root onOpenChange={setIsOpen} open={isOpen} title="Редактирование пользователя">
            <UpsertEntityDialog.Trigger
                onClick={() => {
                    setIsOpen(true);
                }}
                tooltip="Редактировать пользователя"
            >
                <Pencil1Icon />
            </UpsertEntityDialog.Trigger>
            <UpsertEntityDialog.Content>
                <Box asChild pr="3">
                    <ScrollArea size="1">
                        <UserForm end={<UpsertEntityDialog.Controller />} action={action} user={user} />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
