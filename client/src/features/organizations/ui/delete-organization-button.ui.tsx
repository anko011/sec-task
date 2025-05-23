import { Flex, Strong, Text } from '@radix-ui/themes';

import type { Organization } from '~/entities/organizations';
import { DeleteEntityDialog } from '~/shared/ui/delete-entity-dialog';

export type DeleteOrganizationButtonProps = {
    organization: Organization;
    action?: () => Promise<void> | void;
};

export function DeleteOrganizationButton({ organization, action }: DeleteOrganizationButtonProps) {
    return (
        <DeleteEntityDialog.Root confirmation={organization.name} title="Удаление организации">
            <DeleteEntityDialog.Trigger tooltip="Удалить организацию" />
            <DeleteEntityDialog.Content>
                <Flex asChild direction="column" gap="2">
                    <form action={action}>
                        <Text>
                            Вы действительно хотите удалить организацию: <Strong>{organization.name}</Strong>
                        </Text>
                        <Text>
                            Для удаления введите: <Strong>{organization.name}</Strong>
                        </Text>
                        <DeleteEntityDialog.ConfirmationField />
                        <DeleteEntityDialog.Controller />
                    </form>
                </Flex>
            </DeleteEntityDialog.Content>
        </DeleteEntityDialog.Root>
    );
}
