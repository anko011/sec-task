import { PlusIcon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';

import type { UserFormErrors, UserFormValues } from '~/entities/users';
import { UserForm } from '~/entities/users';
import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';

export type CreateUserButtonProps = {
    setIsOpen: (isOpen: boolean) => void;
    isOpen: boolean;
    action?: (values: UserFormValues) => Promise<UserFormErrors> | UserFormErrors;
};

export function CreateUserButton({ action, isOpen, setIsOpen }: CreateUserButtonProps) {
    return (
        <UpsertEntityDialog.Root onOpenChange={setIsOpen} open={isOpen} title="Создание пользователя">
            <UpsertEntityDialog.Trigger
                onClick={() => {
                    setIsOpen(true);
                }}
                tooltip="Создать пользователя"
            >
                <PlusIcon />
            </UpsertEntityDialog.Trigger>
            <UpsertEntityDialog.Content>
                <Box asChild pr="3">
                    <ScrollArea size="1">
                        <UserForm action={action} end={<UpsertEntityDialog.Controller />} />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
