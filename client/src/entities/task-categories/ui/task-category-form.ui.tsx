import { Flex, Select, Text, TextField } from '@radix-ui/themes';
import type { FormEventHandler } from 'react';

import type { TaskCategory } from '../model/task-category';

export type TaskCategoryFormProps = {
    category?: TaskCategory | null;
    formId: string;
    onSubmit?: () => void;
};

export function TaskCategoryForm({ category, formId, onSubmit }: TaskCategoryFormProps) {
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        onSubmit?.();
    };

    return (
        <form id={formId} onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
                <label>
                    <Text as="div" mb="1" size="2" weight="bold">
                        Название категории
                    </Text>
                    <TextField.Root defaultValue={category?.name} placeholder="Введите название категории" />
                </label>
                <label>
                    <Text as="div" mb="1" size="2" weight="bold">
                        Цвет категории
                    </Text>
                    <Select.Root defaultValue={category?.color ?? 'red'}>
                        <Select.Trigger />
                        <Select.Content>
                            <Select.Item value="red">Красный</Select.Item>
                            <Select.Item value="green">Зеленый</Select.Item>
                            <Select.Item value="blue">Синий</Select.Item>
                            <Select.Item value="yellow">Желтый</Select.Item>
                            <Select.Item value="orange">Оранжевый</Select.Item>
                            <Select.Item value="jade">Нефрит</Select.Item>
                            <Select.Item value="cyan">Голубой</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </label>
            </Flex>
        </form>
    );
}
