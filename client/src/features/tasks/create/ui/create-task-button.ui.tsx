import { PlusIcon } from '@radix-ui/react-icons';
import { useId } from 'react';

import { type TaskDTO, TaskForm } from '~/entities/tasks';
import { DialogButton } from '~/shared/ui/dialog-button';

export type CreateTaskButtonProps = {
    onCreateTask?: (task: TaskDTO) => void;
};

export function CreateTaskButton({ onCreateTask }: CreateTaskButtonProps) {
    const formId = useId();
    return (
        <DialogButton
            dialogMinWidth="50vw"
            dialogTitle="Создание задачи"
            formId={formId}
            icon={<PlusIcon />}
            tooltip="Создать задачу"
        >
            <TaskForm formId={formId} onSubmit={onCreateTask} />
        </DialogButton>
    );
}
