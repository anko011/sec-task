import { Flex, Strong, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { useActionState } from 'react';

import type { TaskPackage } from '~/entities/task-packages';
import { deleteTaskPackage, useTaskPackages } from '~/entities/task-packages';

type DeleteTaskPackageFormProps = { end?: ReactNode; taskPackage: TaskPackage };
type DeleteTaskPackageFormState = { isSuccess: boolean };

async function deleteTaskPackageAction({
    taskPackageId
}: DeleteTaskPackageFormState & {
    taskPackageId: string;
}) {
    try {
        await deleteTaskPackage(taskPackageId);
        return { isSuccess: true, taskPackageId: taskPackageId };
    } catch {
        return { isSuccess: false, taskPackageId: taskPackageId };
    }
}

export function DeleteTaskPackageForm({ end, taskPackage }: DeleteTaskPackageFormProps) {
    const { mutate } = useTaskPackages();

    const action = async (prevState: DeleteTaskPackageFormState): Promise<DeleteTaskPackageFormState> => {
        const state = await deleteTaskPackageAction({ ...prevState, taskPackageId: taskPackage.id });
        if (state.isSuccess) await mutate();
        return state;
    };

    const [, dispatch] = useActionState(action, { isSuccess: true });
    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <Text>
                    Вы действительно хотите удалить пакет: <Strong>{taskPackage.outgoingRequisite}</Strong>
                </Text>
                {end}
            </form>
        </Flex>
    );
}
