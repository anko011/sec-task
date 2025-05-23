import { useState } from 'react';
import { toast } from 'react-toastify';
import { takeFirstElements, useStrictContext } from '~/shared/lib';

import { CreateTaskNameButton, DeleteTaskNameButton, EditTaskNameButton } from '~/features/task-names';
import {
    CreateTaskNameContract,
    EditTaskNameContract,
    type TaskName,
    type TaskNameFormErrors,
    type TaskNameFormValues,
    TaskNamesView,
    TaskNamesViewContext
} from '~/entities/task-names';

function Delete({ taskName }: { taskName: TaskName }) {
    const { remove } = useStrictContext(TaskNamesViewContext);

    const action = async () => {
        await remove(taskName.id);
        toast.success(`Наименование ${taskName.title} успешно удалено`);
    };
    return <DeleteTaskNameButton taskName={taskName} action={action} />;
}

function Edit({ taskName }: { taskName: TaskName }) {
    const [isOpen, setIsOpen] = useState(false);
    const { edit } = useStrictContext(TaskNamesViewContext);

    const action = async (values: TaskNameFormValues): Promise<TaskNameFormErrors> => {
        const validation = EditTaskNameContract.safeParse(values);
        if (validation.success) {
            await edit(taskName.id, validation.data);
            toast.success('Наименование успешно отредактировано');
            setIsOpen(false);
            return {};
        }

        return takeFirstElements(validation.error.flatten().fieldErrors);
    };
    return <EditTaskNameButton action={action} isOpen={isOpen} setIsOpen={setIsOpen} taskName={taskName} />;
}

function Create() {
    const { create } = useStrictContext(TaskNamesViewContext);
    const [isOpen, setIsOpen] = useState(false);

    const action = async (values: TaskNameFormValues): Promise<TaskNameFormErrors> => {
        const validation = CreateTaskNameContract.safeParse(values);
        if (validation.success) {
            await create(validation.data);
            toast.success('Наименование успешно создано');
            setIsOpen(false);
            return {};
        }
        return takeFirstElements(validation.error.flatten().fieldErrors);
    };
    return <CreateTaskNameButton setIsOpen={setIsOpen} isOpen={isOpen} action={action} />;
}

export const TaskNamesBuilder = { ...TaskNamesView, Create, Delete, Edit };
