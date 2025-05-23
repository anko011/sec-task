import { Button, Flex, ScrollArea, Select, TextField, Tooltip } from '@radix-ui/themes';
import { type ChangeEventHandler, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import { useDebouncedCallback } from 'use-debounce';

import { Loader } from '~/shared/ui/loader';
import { axiosInstance, type Paginated } from '~/shared/api';
import useSWR from 'swr';

interface BaseItem {
    id: string;

    [key: string]: unknown;
}

export type GenericAsyncSelectorProps<T extends BaseItem> = Select.RootProps & {
    endpoint: string;
    parse: (data: unknown) => Paginated<T>;
    onChange?: (item: T | undefined) => void;
    placeholder?: string;
    queryParam?: string;
    displayField?: keyof T;
};

export function GenericAsyncSelector<T extends BaseItem>({
    name,
    defaultValue = '-1',
    endpoint,
    parse,
    onChange,
    placeholder = 'Введите значение',
    queryParam = 'title',
    displayField = 'title',
    ...props
}: GenericAsyncSelectorProps<T>) {
    const [query, setQuery] = useState('');
    const [limit, setLimit] = useState(10);
    const [selectedItem, setSelectedItem] = useState<T | undefined>();

    const queryKey = `${endpoint}?${queryParam}=${encodeURIComponent(query)}&limit=${limit}&offset=0`;

    const { data, isLoading } = useSWRImmutable(
        queryKey,
        async (url) => {
            const response = await axiosInstance.get(url);
            return parse(response.data);
        },
        { revalidateOnMount: true }
    );

    const isNotExistsInLoad = defaultValue !== '-1' && !data?.items.find((t) => t.id === defaultValue);

    const { data: existingItem } = useSWR(isNotExistsInLoad ? [endpoint, 'selector'] : null, async () => {
        const response = await axiosInstance.get(`${endpoint}/${defaultValue}`);
        return response.data;
    });

    const handleQueryChange = useDebouncedCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
        setQuery(e.target.value);
    }, 300);

    const handleValueChange = (value: string) => {
        if (value === '-1') {
            setSelectedItem(undefined);
            onChange?.(undefined);
            return;
        }

        const found = data?.items.find((item) => item.id === value);
        setSelectedItem(found);
        onChange?.(found);
    };

    const getDisplayValue = (item?: T) => (item ? String(item[displayField] ?? '') : '');

    const hasMore = !!data && data.items.length < data.total;

    const loadMore = () => {
        if (!hasMore) return;
        setLimit((prev) => prev + 10);
    };

    return (
        <Select.Root defaultValue={defaultValue} name={name} onValueChange={handleValueChange} {...props}>
            <Select.Trigger />
            <Select.Content>
                <ScrollArea style={{ maxHeight: '425px' }}>
                    <TextField.Root onChange={handleQueryChange} placeholder={placeholder} />

                    <Select.Item textValue="" value="-1">
                        Не выбрано
                    </Select.Item>

                    {!!existingItem && isNotExistsInLoad ? (
                        <Select.Item value={defaultValue}>{getDisplayValue(existingItem)}</Select.Item>
                    ) : null}

                    {selectedItem ? (
                        <Select.Item textValue={getDisplayValue(selectedItem)} value={selectedItem.id}>
                            {getDisplayValue(selectedItem)}
                        </Select.Item>
                    ) : null}

                    {data?.items
                        .filter((item) => item.id !== selectedItem?.id)
                        .map((item) => (
                            <Tooltip content={getDisplayValue(item)} key={item.id}>
                                <Select.Item textValue="$" value={item.id}>
                                    {getDisplayValue(item)}
                                </Select.Item>
                            </Tooltip>
                        ))}

                    {isLoading ? (
                        <Loader />
                    ) : (
                        hasMore && (
                            <Flex my="2" justify="center">
                                <Button size="1" onClick={loadMore} variant="soft">
                                    Загрузить ещё
                                </Button>
                            </Flex>
                        )
                    )}
                </ScrollArea>
            </Select.Content>
        </Select.Root>
    );
}
