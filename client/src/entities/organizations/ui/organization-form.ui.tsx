import { Checkbox, Flex, TextField } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { useActionState } from 'react';

import { OrganizationTypesSelector } from '~/entities/organization-types';
import { FormField } from '~/shared/ui/form-field';

import type { Organization } from '../model';

export type OrganizationFormState = { isSuccess: boolean } & Partial<
    Omit<Organization, 'id' | 'type' | 'isArchived'> & {
        isArchived: string;
        typeId: string;
    }
>;

type OrganizationFormProps = {
    action: (prevState: OrganizationFormState, formData: FormData) => Promise<OrganizationFormState>;
    end?: ReactNode;
    organization?: Organization;
};

export function OrganizationForm({ action, end, organization }: OrganizationFormProps) {
    const [state, dispatch] = useActionState(action, { isSuccess: true });
    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <FormField error={state.name} label="Название">
                    <TextField.Root
                        defaultValue={organization?.name}
                        name="name"
                        placeholder="Муниципальное учреждение"
                    />
                </FormField>
                <FormField error={state.typeId} label="Тип организации">
                    <OrganizationTypesSelector defaultValue={organization?.type.id} name="typeId" />
                </FormField>
                <FormField direction="row" error={state.isArchived} label="Архивная?">
                    <Checkbox defaultChecked={organization?.isArchived} name="isArchived" />
                </FormField>
                {end}
            </form>
        </Flex>
    );
}
