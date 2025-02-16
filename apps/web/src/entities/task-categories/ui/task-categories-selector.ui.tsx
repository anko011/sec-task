import { Select } from '@radix-ui/themes';
import { use } from 'react';

import type { TaskCategory } from '../model/task-category';

export type TaskCategoriesSelectorProps = Select.RootProps & {
    data: Promise<TaskCategory[]>;
};

export function TaskCategoriesSelector({ data, ...props }: TaskCategoriesSelectorProps) {
    const categories = use(data);
    return (
        <Select.Root defaultValue={categories.at(0)?.id} {...props}>
            <Select.Trigger />
            <Select.Content>
                {categories.map((category: TaskCategory) => (
                    <Select.Item key={category.id} value={category.id}>
                        {category.name}
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    );
}
