import { Flex, Text } from '@radix-ui/themes';
import { useSearchParams } from 'react-router';

import type { OrganizationType } from '~/entities/organization-types';
import { OrganizationTypesSelector } from '~/entities/organization-types';
import { SelectSearchField } from '~/shared/ui/select-search-field';
import { StringSearchField } from '~/shared/ui/string-search-field';

export function SearchOrganizationsByArchiveStatus() {
    return (
        <SelectSearchField
            items={[
                { label: 'Архивирован', value: 'on' },
                { label: 'Активен', value: 'off' }
            ]}
            label="Статус архивации"
            property="archived"
        />
    );
}

export function SearchOrganizationsByName() {
    return <StringSearchField placeholder="Введите название..." property="name" style={{ width: '11rem' }} />;
}

export function SearchOrganizationsByType() {
    const [searchParams, setSearchParams] = useSearchParams();

    const onChange = (typeId?: OrganizationType) => {
        setSearchParams((p) => {
            p.delete('typeId');
            if (typeId != null) p.set('typeId', typeId.id);
            return p;
        });
    };

    return (
        <Flex align="center" asChild gap="2">
            <label>
                <Text size="2">Тип</Text>
                <OrganizationTypesSelector defaultValue={searchParams.get('typeId') ?? '-1'} onChange={onChange} />
            </label>
        </Flex>
    );
}
