import { type ReactNode, useActionState } from 'react';
import { Flex, TextField } from '@radix-ui/themes';

import { FormField } from '~/shared/ui/form-field';

import type { OrganizationType } from '../model/organization-type';

export type OrganizationTypeFormValues = {
    title?: string;
};

export type OrganizationTypeFormErrors = {
    title?: string;
};

export type OrganizationTypeFormProps = {
    action?: (values: OrganizationTypeFormValues) => Promise<OrganizationTypeFormErrors> | OrganizationTypeFormErrors;
    end?: ReactNode;
    organizationType?: OrganizationType;
};

export function OrganizationTypeForm({ action, end, organizationType }: OrganizationTypeFormProps) {
    const submit = async (errors: OrganizationTypeFormErrors, formData: FormData) => {
        if (!action) return errors;
        return action({
            title: formData.get('title') as string
        });
    };
    const [errors, dispatch] = useActionState(submit, {});
    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <FormField error={errors.title} label="Наименование">
                    <TextField.Root
                        defaultValue={organizationType?.title}
                        name="title"
                        placeholder="Введите наименование типа организации"
                    />
                </FormField>
                {end}
            </form>
        </Flex>
    );
}
