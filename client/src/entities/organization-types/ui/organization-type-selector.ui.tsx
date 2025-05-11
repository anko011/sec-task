import { Select, TextField, Tooltip } from '@radix-ui/themes';
import type { ChangeEventHandler } from 'react';
import { memo, useState } from 'react';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';

import type { OrganizationType } from '~/entities/organization-types';
import { findAllOrganizationTypes } from '~/entities/organization-types';
import { Loader } from '~/shared/ui/loader';

export type OrganizationTypesSelectorProps = {
    name?: string;
    defaultValue?: string;
    onChange?: (type: OrganizationType | undefined) => void;
};

export const OrganizationTypesSelector = memo(function ({
    name,
    defaultValue = '-1',
    onChange
}: OrganizationTypesSelectorProps) {
    const [typeName, setTypeName] = useState('');
    const [currentValue, setCurrentValue] = useState<OrganizationType | undefined>();

    const { data, isLoading } = useSWR(`organization-types?name?=${typeName}`, () =>
        findAllOrganizationTypes(new URLSearchParams([['name', typeName]]))
    );

    const onTypeNameChange = useDebouncedCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
        setTypeName(e.target.value);
    }, 350);

    const onValueChange = (value: string) => {
        if (value === '-1') {
            setTypeName('');
            setCurrentValue(undefined);
            onChange?.(undefined);
        } else {
            const type = data?.items.find((item) => item.id === value);
            setCurrentValue(type);
            onChange?.(type);
        }
    };

    return (
        <Select.Root defaultValue={defaultValue} name={name} onValueChange={onValueChange}>
            <Select.Trigger />
            <Select.Content>
                <TextField.Root onChange={onTypeNameChange} placeholder="Введите название типа" />
                <Select.Item textValue="" value="-1">
                    Не выбрано
                </Select.Item>
                {currentValue !== undefined && (
                    <Select.Item textValue="$" value={currentValue.id}>
                        {currentValue.name}
                    </Select.Item>
                )}
                {isLoading ? (
                    <Loader />
                ) : (
                    data?.items
                        .filter((item) => item.id !== currentValue?.id)
                        .map((item) => (
                            <Tooltip content={item.name} key={item.id}>
                                <Select.Item textValue="$" value={item.id}>
                                    {item.name.slice(0, 30)}...
                                </Select.Item>
                            </Tooltip>
                        ))
                )}
            </Select.Content>
        </Select.Root>
    );
});
