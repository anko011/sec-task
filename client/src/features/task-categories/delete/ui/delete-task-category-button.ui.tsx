import { Strong, Text } from '@radix-ui/themes';

import type { TaskCategory } from '~/entities/task-categories';
import { DeleteEntityDialog } from '~/shared/ui/delete-entity-dialog';

import { DeleteTaskCategoryForm } from './delete-task-category-form.ui';

export type DeleteOrganizationButtonProps = {
    taskCategory: TaskCategory;
};

export function DeleteTaskCategoryButton({ taskCategory }: DeleteOrganizationButtonProps) {
    return (
        <DeleteEntityDialog.Root confirmation={taskCategory.name} title="Удаление категории">
            <DeleteEntityDialog.Trigger tooltip="Удалить категорию" />
            <DeleteEntityDialog.Content>
                <DeleteTaskCategoryForm
                    end={
                        <>
                            <Text>
                                Для удаления введите: <Strong>{taskCategory.name}</Strong>
                            </Text>
                            <DeleteEntityDialog.ConfirmationField />
                            <DeleteEntityDialog.Controller />
                        </>
                    }
                    taskCategory={taskCategory}
                />
            </DeleteEntityDialog.Content>
        </DeleteEntityDialog.Root>
    );
}
