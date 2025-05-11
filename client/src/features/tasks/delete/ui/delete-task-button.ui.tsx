import { TrashIcon } from '@radix-ui/react-icons';

import type { TaskDTO } from '~/entities/tasks';
import { AlertDialogButton } from '~/shared/ui/alert-dialog-button';

export type DeleteTaskButtonProps = {
    task: TaskDTO;
};

export function DeleteTaskButton({ task }: DeleteTaskButtonProps) {
    return (
        <AlertDialogButton color="red" dialogTitle="Удаление задания" icon={<TrashIcon />} tooltip="Удалить задание">
            Вы действительно хотите удалить задание "{task.number}?"
        </AlertDialogButton>
    );
}
