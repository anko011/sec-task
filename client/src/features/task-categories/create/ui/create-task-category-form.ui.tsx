import type { ReactNode } from 'react';

import type { TaskCategoryFormState } from '~/entities/task-categories';
import { createTaskCategory, TaskCategoryForm, useTaskCategories } from '~/entities/task-categories';
import { getFieldErrors } from '~/shared/api';

async function createTaskCategoryAction(_: TaskCategoryFormState, formData: FormData): Promise<TaskCategoryFormState> {
    const data = Object.fromEntries(formData);

    try {
        await createTaskCategory(data);
        return { isSuccess: true };
    } catch (e) {
        return { ...getFieldErrors(e), isSuccess: false };
    }
}

export function CreateTaskCategoryForm({ end, onSuccess }: { end?: ReactNode; onSuccess?: () => void }) {
    const { mutate } = useTaskCategories();
    const action = async (prevState: TaskCategoryFormState, formData: FormData) => {
        const state = await createTaskCategoryAction(prevState, formData);
        if (state.isSuccess) {
            onSuccess?.();
            await mutate();
        }
        return state;
    };

    return <TaskCategoryForm action={action} end={end} />;
}
