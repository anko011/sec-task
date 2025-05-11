import { Flex, Select, Text, TextField } from '@radix-ui/themes';
import { Suspense, use, useState } from 'react';

import type { OrganizationType } from '~/entities/organization-types';
import { findAllOrganizationTypes } from '~/entities/organization-types';
import { Loader } from '~/shared/ui/loader';

export type FilterOrganizationTypeSelectorProps = {
    onChange?: (typeId?: string) => void;
};

function Items({ data }: { data: Promise<OrganizationType[]> }) {
    const types = use(data);
    return (
        <>
            {types.map((type) => (
                <Select.Item key={type.id} value={type.id}>
                    {type.name}
                </Select.Item>
            ))}
        </>
    );
}

export function FilterOrganizationTypeSelector({ onChange }: FilterOrganizationTypeSelectorProps) {
    const [name, setName] = useState('');

    const handleChangeStatus = (value: string) => {
        setName('');
        onChange?.(value === '-1' ? undefined : value);
    };

    const types = findAllOrganizationTypes().then(({ items }) => items);

    return (
        <Flex align="center" asChild gap="2">
            <label>
                <Text size="2">Тип организации</Text>
                <Select.Root defaultValue="-1" onValueChange={handleChangeStatus}>
                    <Select.Trigger />
                    <Select.Content>
                        <TextField.Root
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            placeholder="Введите название типа"
                        />
                        <Select.Item value="-1">Не выбрано</Select.Item>
                        <Suspense fallback={<Loader />}>
                            <Items data={types} />
                        </Suspense>
                    </Select.Content>
                </Select.Root>
            </label>
        </Flex>
    );
}
