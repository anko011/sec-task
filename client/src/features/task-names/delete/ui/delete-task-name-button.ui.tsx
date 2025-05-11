import { Strong, Text } from '@radix-ui/themes';

import type { TaskName } from '~/entities/task-names';
import { DeleteEntityDialog } from '~/shared/ui/delete-entity-dialog';

import { DeleteTaskNameForm } from './delete-task-name-form.ui';

export type DeleteTaskNameButtonProps = {
    taskName: TaskName;
};

export function DeleteTaskNameButton({ taskName }: DeleteTaskNameButtonProps) {
    return (
        <DeleteEntityDialog.Root confirmation={taskName.name} title="Удаление наименования">
            <DeleteEntityDialog.Trigger tooltip="Удалить наименование" />
            <DeleteEntityDialog.Content>
                <DeleteTaskNameForm
                    end={
                        <>
                            <Text>
                                Для удаления введите: <Strong>{taskName.name}</Strong>
                            </Text>
                            <DeleteEntityDialog.ConfirmationField />
                            <DeleteEntityDialog.Controller />
                        </>
                    }
                    taskName={taskName}
                />
            </DeleteEntityDialog.Content>
        </DeleteEntityDialog.Root>
    );
}
