import { Flex, Text, TextField } from '@radix-ui/themes';
import type { FormEventHandler } from 'react';

import type { OrganizationType } from '../model';

export type OrganizationTypeFormProps = {
    formId: string;
    onSubmit?: () => void;
    organizationType?: OrganizationType | null;
};

export function OrganizationTypeForm({ formId, onSubmit, organizationType }: OrganizationTypeFormProps) {
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        onSubmit?.();
    };

    return (
        <form id={formId} onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
                <label>
                    <Text as="div" mb="1" size="2" weight="bold">
                        Название типа организации
                    </Text>
                    <TextField.Root
                        defaultValue={organizationType?.name}
                        placeholder="Введите название типа организации"
                    />
                </label>
            </Flex>
        </form>
    );
}
