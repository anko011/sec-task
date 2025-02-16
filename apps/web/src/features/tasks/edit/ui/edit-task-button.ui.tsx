import { Pencil1Icon } from '@radix-ui/react-icons';
import { useId } from 'react';

import { type TaskDTO, TaskForm } from '~/entities/tasks';
import { DialogButton } from '~/shared/ui/dialog-button';

export type EditTaskButtonProps = {
    onUpdateTask?: (task: TaskDTO) => void;
    task: TaskDTO;
};

export function EditTaskButton({ onUpdateTask, task }: EditTaskButtonProps) {
    const formId = useId();
    return (
        <DialogButton
            dialogMinWidth="50vw"
            dialogTitle="Редактирование задачи"
            formId={formId}
            icon={<Pencil1Icon />}
            tooltip="Редактировать задачу"
        >
            <TaskForm formId={formId} onSubmit={onUpdateTask} task={task} />
        </DialogButton>
    );
}
