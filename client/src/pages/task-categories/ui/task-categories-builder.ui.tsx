import { useState } from 'react';
import { toast } from 'react-toastify';

import { CreateTaskCategoryButton, DeleteTaskCategoryButton, EditTaskCategoryButton } from '~/features/task-categories';
import {
    CreateTaskCategoryContract,
    EditTaskCategoryContract,
    TaskCategoriesView,
    TaskCategoriesViewContext,
    type TaskCategory,
    type TaskCategoryFormErrors,
    type TaskCategoryFormValues
} from '~/entities/task-categories';
import { takeFirstElements, useStrictContext } from '~/shared/lib';

function Delete({ taskCategory }: { taskCategory: TaskCategory }) {
    const { remove } = useStrictContext(TaskCategoriesViewContext);

    const action = async () => {
        await remove(taskCategory.id);
        toast.success(`Категория ${taskCategory.title} успешно удалена`);
    };
    return <DeleteTaskCategoryButton taskCategory={taskCategory} action={action} />;
}

function Edit({ taskCategory }: { taskCategory: TaskCategory }) {
    const [isOpen, setIsOpen] = useState(false);
    const { edit } = useStrictContext(TaskCategoriesViewContext);

    const action = async (values: TaskCategoryFormValues): Promise<TaskCategoryFormErrors> => {
        const validation = EditTaskCategoryContract.safeParse(values);
        if (validation.success) {
            await edit(taskCategory.id, validation.data);
            toast.success('Категория успешно отредактирована');
            setIsOpen(false);
            return {};
        }

        return takeFirstElements(validation.error.flatten().fieldErrors);
    };
    return <EditTaskCategoryButton action={action} isOpen={isOpen} setIsOpen={setIsOpen} taskCategory={taskCategory} />;
}

function Create() {
    const { create } = useStrictContext(TaskCategoriesViewContext);
    const [isOpen, setIsOpen] = useState(false);

    const action = async (values: TaskCategoryFormValues): Promise<TaskCategoryFormErrors> => {
        const validation = CreateTaskCategoryContract.safeParse(values);
        if (validation.success) {
            await create(validation.data);
            toast.success('Категория успешно создана');
            setIsOpen(false);
            return {};
        }
        return takeFirstElements(validation.error.flatten().fieldErrors);
    };
    return <CreateTaskCategoryButton setIsOpen={setIsOpen} isOpen={isOpen} action={action} />;
}

export const TaskCategoriesBuilder = {
    ...TaskCategoriesView,
    Create,
    Delete,
    Edit
};
