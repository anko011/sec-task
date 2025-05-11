import { Select, TextField, Tooltip } from '@radix-ui/themes';
import type { ChangeEventHandler } from 'react';
import { memo, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';

import type { TaskCategory } from '~/entities/task-categories';
import { findAllTaskCategories } from '~/entities/task-categories';
import { Loader } from '~/shared/ui/loader';

export type TaskCategoriesSelectorProps = {
    name?: string;
    defaultValue?: string;
    onChange?: (type: TaskCategory | undefined) => void;
};

export const TaskCategoriesSelector = memo(function ({
    name,
    defaultValue = '-1',
    onChange
}: TaskCategoriesSelectorProps) {
    const [categoryName, setCategoryName] = useState('');
    const [currentValue, setCurrentValue] = useState<TaskCategory | undefined>();

    const ref = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const form = ref.current?.form;

        const handler = () => {
            setCategoryName('');
            setCurrentValue(undefined);
        };
        form?.addEventListener('reset', handler);
        return () => {
            form?.removeEventListener('reset', handler);
        };
    }, []);

    const { data, isLoading } = useSWR(`task-categories?name?=${categoryName}`, () =>
        findAllTaskCategories(new URLSearchParams([['name', categoryName]]))
    );

    const onCategoryNameChange = useDebouncedCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
        setCategoryName(e.target.value);
    }, 350);

    const onValueChange = (value: string) => {
        if (value === '-1') {
            setCategoryName('');
            setCurrentValue(undefined);
            onChange?.(undefined);
        } else {
            const type = data?.items.find((item) => item.id === value);
            setCurrentValue(type);
            onChange?.(type);
        }
    };

    return (
        <Select.Root name={name} onValueChange={onValueChange} value={currentValue?.id ?? defaultValue}>
            <Select.Trigger ref={ref} />
            <Select.Content>
                <TextField.Root onChange={onCategoryNameChange} placeholder="Введите название категории" />
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
                                    {item.name}
                                </Select.Item>
                            </Tooltip>
                        ))
                )}
            </Select.Content>
        </Select.Root>
    );
});
