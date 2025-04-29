import { Checkbox, Flex, Select, Text, TextField } from '@radix-ui/themes';
import type { FormEventHandler } from 'react';
import { use } from 'react';

import { OrganizationTypesRepository } from '~/entities/organization-types';

import type { Organization } from '../model';

export type OrganizationFormProps = {
    formId: string;
    onSubmit?: () => void;
    organization?: Organization | null;
};

const data = OrganizationTypesRepository.findAll();

export function OrganizationForm({ formId, onSubmit, organization }: OrganizationFormProps) {
    const organizationTypes = use(data);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        onSubmit?.();
    };

    return (
        <form id={formId} onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
                <label>
                    <Text as="div" mb="1" size="2" weight="bold">
                        Название организации
                    </Text>
                    <TextField.Root defaultValue={organization?.name} placeholder="Введите название компании" />
                </label>
                <label>
                    <Text as="div" mb="1" size="2" weight="bold">
                        Тип организации
                    </Text>
                    <Select.Root defaultValue={organization?.type.id ?? organizationTypes.at(0)?.id}>
                        <Select.Trigger />
                        <Select.Content>
                            {organizationTypes.map((type) => (
                                <Select.Item value={type.id}>{type.name}</Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Root>
                </label>
                <label>
                    <Flex align="center" gap="2">
                        <Text mb="1" size="2" weight="bold">
                            Архивная?
                        </Text>
                        <Checkbox defaultChecked={organization?.isArchived} />
                    </Flex>
                </label>
            </Flex>
        </form>
    );
}
