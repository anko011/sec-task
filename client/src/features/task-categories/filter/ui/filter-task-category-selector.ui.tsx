import { Flex, Select, Text } from '@radix-ui/themes';
import { use } from 'react';

import type { TaskCategory } from '~/entities/task-categories';

const data: Promise<TaskCategory[]> = Promise.resolve([]);

export function FilterTaskCategorySelector() {
    const categories = use(data);
    return (
        <Flex align="center" asChild gap="2">
            <label>
                <Text size="2">Категория задачи</Text>
                <Select.Root defaultValue="-1">
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Item value="-1">Не выбрано</Select.Item>
                        {categories.map((category) => (
                            <Select.Item key={category.id} value={category.id}>
                                {category.name}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
            </label>
        </Flex>
    );
}
