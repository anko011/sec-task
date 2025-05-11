import { Flex, Strong, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { useActionState } from 'react';

import type { OrganizationType } from '~/entities/organization-types';
import { deleteOrganizationType, useOrganizationTypes } from '~/entities/organization-types';

type DeleteOrganizationTypeFormProps = { end?: ReactNode; organizationType: OrganizationType };
type DeleteOrganizationTypeFormState = { isSuccess: boolean };

async function deleteOrganizationTypeAction({
    organizationTypeId
}: DeleteOrganizationTypeFormState & {
    organizationTypeId: string;
}) {
    try {
        await deleteOrganizationType(organizationTypeId);
        return { isSuccess: true, organizationTypeId };
    } catch {
        return { isSuccess: false, organizationTypeId };
    }
}

export function DeleteOrganizationTypeForm({ end, organizationType }: DeleteOrganizationTypeFormProps) {
    const { mutate } = useOrganizationTypes();

    const action = async (prevState: DeleteOrganizationTypeFormState): Promise<DeleteOrganizationTypeFormState> => {
        const state = await deleteOrganizationTypeAction({ ...prevState, organizationTypeId: organizationType.id });
        if (state.isSuccess) await mutate();
        return state;
    };

    const [, dispatch] = useActionState(action, { isSuccess: true });
    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <Text>
                    Вы действительно хотите удалить тип: <Strong>{organizationType.name}</Strong>
                </Text>
                {end}
            </form>
        </Flex>
    );
}
