import { Flex, Strong, Text } from '@radix-ui/themes';
import { useActionState } from 'react';
import { useSWRConfig } from 'swr';

import type { Organization } from '~/entities/organizations';
import { deleteOrganization } from '~/entities/organizations';
import { DeleteEntityDialog } from '~/shared/ui/delete-entity-dialog';

export type DeleteOrganizationButtonProps = {
    organization: Organization;
};

type FormState = {
    isSuccess: boolean;
    organizationId: string;
};

async function deleteOrganizationAction({ organizationId }: FormState) {
    try {
        await deleteOrganization(organizationId);
        return { isSuccess: true, organizationId };
    } catch {
        return { isSuccess: false, organizationId };
    }
}

export function DeleteOrganizationButton({ organization }: DeleteOrganizationButtonProps) {
    const { mutate } = useSWRConfig();

    const action = async (prevState: FormState) => {
        const state = await deleteOrganizationAction(prevState);
        if (state.isSuccess)
            await mutate((key) => Array.isArray(key) && key[0] === 'organizations', undefined, {
                revalidate: true
            });
        return state;
    };

    const [, dispatch] = useActionState(action, { isSuccess: true, organizationId: organization.id });
    return (
        <DeleteEntityDialog.Root confirmation={organization.name} title="Удаление организации">
            <DeleteEntityDialog.Trigger tooltip="Удалить организацию" />
            <DeleteEntityDialog.Content>
                <Flex asChild direction="column" gap="2">
                    <form action={dispatch}>
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
