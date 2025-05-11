import type { ReactNode } from 'react';

import type { TaskNameFormState } from '~/entities/task-names';
import { createTaskName, TaskNameForm, useTaskNames } from '~/entities/task-names';
import { getFieldErrors } from '~/shared/api';

export async function createTaskNameAction(_: TaskNameFormState, formData: FormData): Promise<TaskNameFormState> {
    const data = Object.fromEntries(formData);

    try {
        await createTaskName(data);
        return { isSuccess: true };
    } catch (e) {
        return { ...getFieldErrors(e), isSuccess: false };
    }
}

export function CreateTaskNameForm({ end, onSuccess }: { end?: ReactNode; onSuccess?: () => void }) {
    const { mutate } = useTaskNames();

    const action = async (prevState: TaskNameFormState, formData: FormData) => {
        const state = await createTaskNameAction(prevState, formData);
        if (state.isSuccess) {
            onSuccess?.();
            await mutate();
        }
        return state;
    };

    return <TaskNameForm action={action} end={end} />;
}
