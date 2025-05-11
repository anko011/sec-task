import { Flex, TextField } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { useActionState } from 'react';

import { FormField } from '~/shared/ui/form-field';

import type { OrganizationType } from '../model';

export type OrganizationTypeFormState = { isSuccess: boolean } & Partial<Omit<OrganizationType, 'id'>>;

export type OrganizationTypeFormProps = {
    action: (prevState: OrganizationTypeFormState, formData: FormData) => Promise<OrganizationTypeFormState>;
    end?: ReactNode;
    organizationType?: OrganizationType;
};

export function OrganizationTypeForm({ action, end, organizationType }: OrganizationTypeFormProps) {
    const [state, dispatch] = useActionState(action, { isSuccess: true });
    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <FormField error={state.name} label="Наименование">
                    <TextField.Root
                        defaultValue={organizationType?.name}
                        name="name"
                        placeholder="Введите наименование типа организации"
                    />
                </FormField>
                {end}
            </form>
        </Flex>
    );
}
