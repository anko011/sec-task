import type { ReactNode } from 'react';

import type { TaskCategory, TaskCategoryFormState } from '~/entities/task-categories';
import { TaskCategoryForm, updateTaskCategory, useTaskCategories } from '~/entities/task-categories';
import { getFieldErrors } from '~/shared/api/query';

type EditTaskCategoryFormState = { taskCategoryId: string } & TaskCategoryFormState;
type EditTaskCategoryFormProps = { end?: ReactNode; onSuccess?: () => void; taskCategory: TaskCategory };

export async function editTaskCategoryAction(
    { taskCategoryId }: EditTaskCategoryFormState,
    formData: FormData
): Promise<EditTaskCategoryFormState> {
    const data = Object.fromEntries(formData);
    try {
        await updateTaskCategory(taskCategoryId, data);
        return { isSuccess: true, taskCategoryId };
    } catch (e) {
        return { ...getFieldErrors(e), isSuccess: false, taskCategoryId };
    }
}

export function EditTaskCategoryForm({ end, onSuccess, taskCategory }: EditTaskCategoryFormProps) {
    const { mutate } = useTaskCategories();

    const action = async (prevState: TaskCategoryFormState, formData: FormData) => {
        const state = await editTaskCategoryAction({ ...prevState, taskCategoryId: taskCategory.id }, formData);
        if (state.isSuccess) {
            onSuccess?.();
            await mutate();
        }
        return state;
    };

    return <TaskCategoryForm action={action} end={end} taskCategory={taskCategory} />;
}
