import { Strong, Text } from '@radix-ui/themes';

import type { OrganizationType } from '~/entities/organization-types';
import { DeleteOrganizationTypeForm } from '~/features/organization-types/delete/ui/delete-organization-type-form.ui';
import { DeleteEntityDialog } from '~/shared/ui/delete-entity-dialog';

export type DeleteOrganizationTypeButtonProps = {
    organizationType: OrganizationType;
};

export function DeleteOrganizationTypeButton({ organizationType }: DeleteOrganizationTypeButtonProps) {
    return (
        <DeleteEntityDialog.Root confirmation={organizationType.name} title="Удаление типа организации">
            <DeleteEntityDialog.Trigger tooltip="Удалить тип организацию" />
            <DeleteEntityDialog.Content>
                <DeleteOrganizationTypeForm
                    end={
                        <>
                            <Text>
                                Для удаления введите: <Strong>{organizationType.name}</Strong>
                            </Text>
                            <DeleteEntityDialog.ConfirmationField />
                            <DeleteEntityDialog.Controller />
                        </>
                    }
                    organizationType={organizationType}
                />
            </DeleteEntityDialog.Content>
        </DeleteEntityDialog.Root>
    );
}
