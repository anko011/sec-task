import { Pencil1Icon } from '@radix-ui/react-icons';
import { Box, ScrollArea } from '@radix-ui/themes';
import { useState } from 'react';

import type { User, UserWithOrganization } from '~/entities/users';
import { UpsertEntityDialog } from '~/shared/ui/upsert-entity-dialog';

import { EditUserForm } from './edit-user-form.ui';

export type EditUserButtonProps = {
    user: User | UserWithOrganization;
};

export function EditUserButton({ user }: EditUserButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
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
                        <EditUserForm
                            end={<UpsertEntityDialog.Controller />}
                            onSuccess={() => {
                                setIsOpen(false);
                            }}
                            user={user}
                        />
                    </ScrollArea>
                </Box>
            </UpsertEntityDialog.Content>
        </UpsertEntityDialog.Root>
    );
}
