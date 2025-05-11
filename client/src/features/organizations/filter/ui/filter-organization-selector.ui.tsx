import { Select, TextField, Tooltip } from '@radix-ui/themes';
import { Suspense, use, useState } from 'react';

import type { Organization } from '~/entities/organizations';
import { findAllOrganizations } from '~/entities/organizations/api';
import { Loader } from '~/shared/ui/loader';

export type FilterOrganizationSelectorProps = {
    name?: string;
    defaultValue?: string;
    onChange?: (organizationId?: string) => void;
};

function Items({ data }: { data: Promise<Organization[]> }) {
    const items = use(data);
    return (
        <>
            {items.map((item) => (
                <Tooltip content={item.name} key={item.id}>
                    <Select.Item value={item.id}>{item.name.slice(0, 30)}...</Select.Item>
                </Tooltip>
            ))}
        </>
    );
}

export function FilterOrganizationSelector({ name, defaultValue, onChange }: FilterOrganizationSelectorProps) {
    const [text, setText] = useState('');

    const handleChangeStatus = (value: string) => {
        setText('');
        onChange?.(value === '-1' ? undefined : value);
    };

    const urlSearchParams = new URLSearchParams([
        ['name', text],
        ['limit', '20']
    ]);

    const organizations = findAllOrganizations(urlSearchParams).then(({ items }) => items);

    return (
        <Select.Root defaultValue={defaultValue ?? '-1'} name={name} onValueChange={handleChangeStatus}>
            <Select.Trigger />
            <Select.Content>
                <TextField.Root
                    onChange={(e) => {
                        setText(e.target.value);
                    }}
                    placeholder="Введите название организации"
                />
                <Select.Item value="-1">Не выбрано</Select.Item>
                <Suspense fallback={<Loader />}>
                    <Items data={organizations} />
                </Suspense>
            </Select.Content>
        </Select.Root>
    );
}
