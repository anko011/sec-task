import { Checkbox, Flex, TextField } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { useActionState } from 'react';

import { OrganizationTypesSelector } from '~/entities/organization-types';
import { FormField } from '~/shared/ui/form-field';

import type { Organization } from '../model/organization';

export type OrganizationFormValues = {
    name?: string;
    isArchived?: boolean;
    typeId?: string;
};

export type OrganizationFormErrors = {
    name?: string;
    isArchived?: string;
    typeId?: string;
};

export type OrganizationFormProps = {
    action?: (values: OrganizationFormValues) => Promise<OrganizationFormErrors> | OrganizationFormErrors;
    end?: ReactNode;
    organization?: Organization;
};

export function OrganizationForm({ action, end, organization }: OrganizationFormProps) {
    const submit = async (errors: OrganizationFormErrors, formData: FormData) => {
        if (!action) return errors;
        return action({
            name: formData.get('name') as string,
            isArchived: formData.get('isArchived') === 'on',
            typeId: formData.get('typeId') as string
        });
    };
    const [errors, dispatch] = useActionState(submit, {});
    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <FormField error={errors.name} label="Название">
                    <TextField.Root
                        defaultValue={organization?.name}
                        name="name"
                        placeholder="Муниципальное учреждение"
                    />
                </FormField>
                <FormField error={errors.typeId} label="Тип организации">
                    <OrganizationTypesSelector defaultValue={organization?.type.id} name="typeId" />
                </FormField>
                <FormField direction="row" error={errors.isArchived} label="Архивная?">
                    <Checkbox defaultChecked={organization?.isArchived} name="isArchived" />
                </FormField>
                {end}
            </form>
        </Flex>
    );
}
