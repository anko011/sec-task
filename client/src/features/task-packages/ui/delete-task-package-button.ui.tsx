import { Flex, Strong, Text } from '@radix-ui/themes';

import type { TaskPackage } from '~/entities/task-packages';
import { DeleteEntityDialog } from '~/shared/ui/delete-entity-dialog';

export type DeleteTaskPackageButtonProps = {
    taskPackage: TaskPackage;
    action?: () => Promise<void> | void;
};

export function DeleteTaskPackageButton({ taskPackage, action }: DeleteTaskPackageButtonProps) {
    return (
        <DeleteEntityDialog.Root confirmation={taskPackage.outgoingRequisite} title="Удаление пакета документа">
            <DeleteEntityDialog.Trigger tooltip="Удалить пакет документов" />
            <DeleteEntityDialog.Content>
                <Flex asChild direction="column" gap="2">
                    <form action={action}>
                        <Text>
                            Вы действительно хотите удалить пакет: <Strong>{taskPackage.outgoingRequisite}</Strong>
                        </Text>
                        <Text>
                            Для удаления введите: <Strong>{taskPackage.outgoingRequisite}</Strong>
                        </Text>
                        <DeleteEntityDialog.ConfirmationField />
                        <DeleteEntityDialog.Controller />
                    </form>
                </Flex>
            </DeleteEntityDialog.Content>
        </DeleteEntityDialog.Root>
    );
}
