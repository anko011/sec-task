import { PlusIcon } from '@radix-ui/react-icons';
import { useId } from 'react';

import { TaskCategoryForm } from '~/entities/task-categories';
import { DialogButton } from '~/shared/ui/dialog-button';

export function CreateTaskCategoryButton() {
    const formId = useId();
    return (
        <DialogButton
            dialogTitle="Создание категории задачи"
            formId={formId}
            icon={<PlusIcon />}
            tooltip="Создать категорию задачи"
        >
            <TaskCategoryForm formId={formId} />
        </DialogButton>
    );
}
