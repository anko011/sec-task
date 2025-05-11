import { Strong, Text } from '@radix-ui/themes';

import type { TaskPackage } from '~/entities/task-packages';
import { DeleteTaskPackageForm } from '~/features/task-packages/delete/ui/delete-task-package-form.ui';
import { DeleteEntityDialog } from '~/shared/ui/delete-entity-dialog/index';

export type DeleteTaskPackageButtonProps = {
    taskPackage: TaskPackage;
};

export function DeleteTaskPackageButton({ taskPackage }: DeleteTaskPackageButtonProps) {
    return (
        <DeleteEntityDialog.Root confirmation={taskPackage.outgoingRequisite} title="Удаление пакета документа">
            <DeleteEntityDialog.Trigger tooltip="Удалить пакет документов" />
            <DeleteEntityDialog.Content>
                <DeleteTaskPackageForm
                    end={
                        <>
                            <Text>
                                Для удаления введите: <Strong>{taskPackage.outgoingRequisite}</Strong>
                            </Text>
                            <DeleteEntityDialog.ConfirmationField />
                            <DeleteEntityDialog.Controller />
                        </>
                    }
                    taskPackage={taskPackage}
                />
            </DeleteEntityDialog.Content>
        </DeleteEntityDialog.Root>
    );
}
