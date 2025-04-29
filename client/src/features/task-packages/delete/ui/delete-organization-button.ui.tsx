import { TrashIcon } from '@radix-ui/react-icons';
import { Flex, Strong, Text, TextField } from '@radix-ui/themes';
import { useState } from 'react';

import type { TaskPackage } from '~/entities/task-packages';
import { AlertDialogButton } from '~/shared/ui/alert-dialog-button';

export type DeleteTaskPackageButtonProps = {
    taskPackage: TaskPackage;
};

export function DeleteTaskPackageButton({ taskPackage }: DeleteTaskPackageButtonProps) {
    const [incomingRequisite, setIncomingRequisite] = useState('');
    return (
        <AlertDialogButton
            color="red"
            dialogTitle="Удаление пакета заданий"
            disabledSubmit={incomingRequisite !== taskPackage.incomingRequisite}
            icon={<TrashIcon />}
            tooltip="Удалить пакет заданий"
        >
            <Flex direction="column" gap="2">
                <Text>
                    Вы действительно хотите удалить пакет <Strong>{taskPackage.incomingRequisite}</Strong>? Для удаления
                    введите <Strong>{taskPackage.incomingRequisite}</Strong>
                </Text>
                <TextField.Root
                    onChange={(e) => {
                        setIncomingRequisite(e.target.value);
                    }}
                    value={incomingRequisite}
                />
            </Flex>
        </AlertDialogButton>
    );
}
