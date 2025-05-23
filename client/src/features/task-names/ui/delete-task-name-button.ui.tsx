import { Flex, Strong, Text } from '@radix-ui/themes';

import type { TaskName } from '~/entities/task-names';
import { DeleteEntityDialog } from '~/shared/ui/delete-entity-dialog';

export type DeleteTaskNameButtonProps = {
    taskName: TaskName;
    action?: () => Promise<void> | void;
};

export function DeleteTaskNameButton({ taskName, action }: DeleteTaskNameButtonProps) {
    return (
        <DeleteEntityDialog.Root confirmation={taskName.title} title="Удаление наименования">
            <DeleteEntityDialog.Trigger tooltip="Удалить наименование" />
            <DeleteEntityDialog.Content>
                <Flex asChild direction="column" gap="2">
                    <form action={action}>
                        <Text>
                            Вы действительно хотите удалить наименование: <Strong>{taskName.title}</Strong>
                        </Text>
                        <Text>
                            Для удаления введите: <Strong>{taskName.title}</Strong>
                        </Text>
                        <DeleteEntityDialog.ConfirmationField />
                        <DeleteEntityDialog.Controller />
                    </form>
                </Flex>
            </DeleteEntityDialog.Content>
        </DeleteEntityDialog.Root>
    );
}
