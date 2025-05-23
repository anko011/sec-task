import { Flex, Strong, Text } from '@radix-ui/themes';

import type { OrganizationType } from '~/entities/organization-types';
import { DeleteEntityDialog } from '~/shared/ui/delete-entity-dialog';

export type DeleteOrganizationTypeButtonProps = {
    organizationType: OrganizationType;
    action?: () => Promise<void> | void;
};

export function DeleteOrganizationTypeButton({ organizationType, action }: DeleteOrganizationTypeButtonProps) {
    return (
        <DeleteEntityDialog.Root confirmation={organizationType.title} title="Удаление типа организации">
            <DeleteEntityDialog.Trigger tooltip="Удалить тип организацию" />
            <DeleteEntityDialog.Content>
                <Flex asChild direction="column" gap="2">
                    <form action={action}>
                        <Text>
                            Вы действительно хотите удалить тип: <Strong>{organizationType.title}</Strong>
                        </Text>
                        <Text>
                            Для удаления введите: <Strong>{organizationType.title}</Strong>
                        </Text>
                        <DeleteEntityDialog.ConfirmationField />
                        <DeleteEntityDialog.Controller />
                    </form>
                </Flex>
            </DeleteEntityDialog.Content>
        </DeleteEntityDialog.Root>
    );
}
