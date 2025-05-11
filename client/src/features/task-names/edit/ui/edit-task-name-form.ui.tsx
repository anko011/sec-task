import type { ReactNode } from 'react';

import type { TaskName, TaskNameFormState } from '~/entities/task-names';
import { TaskNameForm, updateTaskName, useTaskNames } from '~/entities/task-names';
import { getFieldErrors } from '~/shared/api/query';

type EditTaskNameFormState = { taskNameId: string } & TaskNameFormState;
type EditTaskNameFormProps = { end?: ReactNode; onSuccess?: () => void; taskName: TaskName };

export async function editOrganizationAction(
    { taskNameId }: EditTaskNameFormState,
    formData: FormData
): Promise<EditTaskNameFormState> {
    const data = Object.fromEntries(formData);

    try {
        await updateTaskName(taskNameId, data);
        return { isSuccess: true, taskNameId };
    } catch (e) {
        return { ...getFieldErrors(e), isSuccess: false, taskNameId };
    }
}

export function EditTaskNameForm({ end, onSuccess, taskName }: EditTaskNameFormProps) {
    const { mutate } = useTaskNames();
    const action = async (prevState: TaskNameFormState, formData: FormData) => {
        const state = await editOrganizationAction({ taskNameId: taskName.id, ...prevState }, formData);
        if (state.isSuccess) {
            onSuccess?.();
            await mutate();
        }
        return state;
    };

    return <TaskNameForm action={action} end={end} taskName={taskName} />;
}
