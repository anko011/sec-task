import { Flex, Strong, Text } from '@radix-ui/themes';

import type { TaskCategory } from '~/entities/task-categories';
import { DeleteEntityDialog } from '~/shared/ui/delete-entity-dialog';

export type DeleteOrganizationButtonProps = {
    taskCategory: TaskCategory;
    action?: () => Promise<void> | void;
};

export function DeleteTaskCategoryButton({ taskCategory, action }: DeleteOrganizationButtonProps) {
    return (
        <DeleteEntityDialog.Root confirmation={taskCategory.title} title="Удаление категории">
            <DeleteEntityDialog.Trigger tooltip="Удалить категорию" />
            <DeleteEntityDialog.Content>
                <Flex asChild direction="column" gap="2">
                    <form action={action}>
                        <Text>
                            Вы действительно хотите удалить организацию: <Strong>{taskCategory.title}</Strong>
                        </Text>
                        <Text>
                            Для удаления введите: <Strong>{taskCategory.title}</Strong>
                        </Text>
                        <DeleteEntityDialog.ConfirmationField />
                        <DeleteEntityDialog.Controller />
                    </form>
                </Flex>
            </DeleteEntityDialog.Content>
        </DeleteEntityDialog.Root>
    );
}
