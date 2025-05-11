import { Select, TextField, Tooltip } from '@radix-ui/themes';
import type { ChangeEventHandler } from 'react';
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';

import type { TaskName } from '~/entities/task-names';
import { findAllTaskNames } from '~/entities/task-names';
import { Loader } from '~/shared/ui/loader';

export type TaskNamesSelectorProps = {
    name?: string;
    defaultValue?: string;
    onChange?: (type: TaskName | undefined) => void;
};

export const TaskNamesSelector = function ({ name, defaultValue = '-1', onChange }: TaskNamesSelectorProps) {
    const [taskName, setTaskName] = useState('');
    const [currentValue, setCurrentValue] = useState<TaskName | undefined>();

    const ref = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const form = ref.current?.form;

        const handler = () => {
            setTaskName('');
            setCurrentValue(undefined);
        };
        form?.addEventListener('reset', handler);
        return () => {
            form?.removeEventListener('reset', handler);
        };
    }, []);

    const { data, isLoading } = useSWR(`task-names?name?=${taskName}`, () =>
        findAllTaskNames(new URLSearchParams([['name', taskName]]))
    );

    const onTaskNameChange = useDebouncedCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
        setTaskName(e.target.value);
    }, 350);

    const onValueChange = (value: string) => {
        if (value === '-1') {
            setTaskName('');
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
                <TextField.Root onChange={onTaskNameChange} placeholder="Введите название категории" />
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
};
