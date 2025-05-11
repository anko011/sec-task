import { Flex, Strong, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { useActionState } from 'react';

import type { TaskName } from '~/entities/task-names';
import { deleteTaskName, useTaskNames } from '~/entities/task-names';

export type DeleteTaskNameFormProps = {
    end?: ReactNode;
    taskName: TaskName;
};

type DeleteTaskNameFormState = {
    isSuccess: boolean;
    taskNameId: string;
};

async function deleteTaskNameAction({ taskNameId }: DeleteTaskNameFormState) {
    try {
        await deleteTaskName(taskNameId);
        return { isSuccess: true, taskNameId };
    } catch {
        return { isSuccess: false, taskNameId };
    }
}

export function DeleteTaskNameForm({ end, taskName }: DeleteTaskNameFormProps) {
    const { mutate } = useTaskNames();

    const action = async (prevState: DeleteTaskNameFormState) => {
        const state = await deleteTaskNameAction(prevState);
        if (state.isSuccess) await mutate();
        return state;
    };

    const [, dispatch] = useActionState(action, { isSuccess: true, taskNameId: taskName.id });
    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <Text>
                    Вы действительно хотите удалить наименование: <Strong>{taskName.name}</Strong>
                </Text>
                {end}
            </form>
        </Flex>
    );
}
