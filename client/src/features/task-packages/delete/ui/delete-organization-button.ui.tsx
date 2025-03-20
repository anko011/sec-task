import { TrashIcon } from '@radix-ui/react-icons';

import type { TaskPackage } from '~/entities/task-packages';
import { AlertDialogButton } from '~/shared/ui/alert-dialog-button';

export type DeleteTaskPackageButtonProps = {
    taskPackage: TaskPackage;
};

export function DeleteTaskPackageButton({ taskPackage }: DeleteTaskPackageButtonProps) {
    return (
        <AlertDialogButton
            color="red"
            dialogTitle="Удаление пакета заданий"
            icon={<TrashIcon />}
            tooltip="Удалить пакет заданий"
        >
            Вы действительно хотите удалить пакет "{taskPackage.name}?"
        </AlertDialogButton>
    );
}
