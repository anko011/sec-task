import { TrashIcon } from '@radix-ui/react-icons';

import type { TaskCategory } from '~/entities/task-categories';
import { AlertDialogButton } from '~/shared/ui/alert-dialog-button';

export type DeleteTaskCategoryButtonProps = {
    category: TaskCategory;
};

export function DeleteTaskCategoryButton({ category }: DeleteTaskCategoryButtonProps) {
    return (
        <AlertDialogButton
            color="red"
            dialogTitle="Удаление типа организации"
            icon={<TrashIcon />}
            tooltip="Удалить категорию задачи"
        >
            Вы действительно хотите удалить категорию "{category.name}"?
        </AlertDialogButton>
    );
}
