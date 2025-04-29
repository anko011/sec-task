import { Flex, Select, Text, TextField } from '@radix-ui/themes';
import { Suspense, use, useState } from 'react';

import { TaskCategoriesRepository } from '~/entities/task-categories';
import { Loader } from '~/shared/ui/loader';

import type { TaskCategory } from '../model/task-category';

export type TaskCategoriesSelectorProps = {
    name?: string;
    defaultValue?: string;
    onChange?: (category?: TaskCategory) => void;
};

function Items({ data }: { data: Promise<TaskCategory[]> }) {
    const types = use(data);
    return (
        <>
            {types.map((category) => (
                <Select.Item key={category.id} value={category.id}>
                    {category.name}
                </Select.Item>
            ))}
        </>
    );
}

export function TaskCategoriesSelector({ name: formName, defaultValue, onChange }: TaskCategoriesSelectorProps) {
    const [name, setName] = useState('');
    const categories = TaskCategoriesRepository.findAll({ name });

    const handleChangeStatus = (value: string) => {
        setName('');
        void categories.then((categories) => {
            const category = categories.find(({ id }) => id === value);
            onChange?.(category);
        });
    };

    return (
        <Flex align="center" asChild gap="2">
            <label>
                <Text size="2">Тип организации</Text>
                <Select.Root defaultValue={defaultValue ?? '-1'} onValueChange={handleChangeStatus}>
                    <Select.Trigger />
                    <Select.Content>
                        <TextField.Root
                            name={formName}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            placeholder="Введите название типа"
                        />
                        <Select.Item value="-1">Не выбрано</Select.Item>
                        <Suspense fallback={<Loader />}>
                            <Items data={categories} />
                        </Suspense>
                    </Select.Content>
                </Select.Root>
            </label>
        </Flex>
    );
}
