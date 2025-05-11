import { Flex, Strong, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { useActionState } from 'react';

import type { TaskCategory } from '~/entities/task-categories';
import { deleteTaskCategory, useTaskCategories } from '~/entities/task-categories';

export type DeleteTaskCategoryFormProps = {
    end?: ReactNode;
    taskCategory: TaskCategory;
};

type DeleteTaskCategoryFormState = {
    isSuccess: boolean;
    taskCategoryId: string;
};

async function deleteTaskCategoryAction({
    taskCategoryId
}: DeleteTaskCategoryFormState): Promise<DeleteTaskCategoryFormState> {
    try {
        await deleteTaskCategory(taskCategoryId);
        return { isSuccess: true, taskCategoryId };
    } catch {
        return { isSuccess: false, taskCategoryId };
    }
}

export function DeleteTaskCategoryForm({ end, taskCategory }: DeleteTaskCategoryFormProps) {
    const { mutate } = useTaskCategories();

    const action = async (prevState: DeleteTaskCategoryFormState) => {
        const state = await deleteTaskCategoryAction(prevState);
        if (state.isSuccess) await mutate();
        return state;
    };

    const [, dispatch] = useActionState(action, { isSuccess: true, taskCategoryId: taskCategory.id });

    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <Text>
                    Вы действительно хотите удалить организацию: <Strong>{taskCategory.name}</Strong>
                </Text>
                {end}
            </form>
        </Flex>
    );
}
