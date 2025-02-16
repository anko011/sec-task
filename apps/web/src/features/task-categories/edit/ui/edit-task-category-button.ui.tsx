import { Pencil1Icon } from '@radix-ui/react-icons';
import { useId } from 'react';

import { type TaskCategory, TaskCategoryForm } from '~/entities/task-categories';
import { DialogButton } from '~/shared/ui/dialog-button';

export type EditTaskCategoryButtonProps = {
    category: TaskCategory;
};

export function EditTaskCategoryButton({ category }: EditTaskCategoryButtonProps) {
    const formId = useId();
    return (
        <DialogButton
            dialogTitle="Редактирование категории задачи"
            formId={formId}
            icon={<Pencil1Icon />}
            tooltip="Редактировать категорию задач"
        >
            <TaskCategoryForm category={category} formId={formId} />
        </DialogButton>
    );
}
