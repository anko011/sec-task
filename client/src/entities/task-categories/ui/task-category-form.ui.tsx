import { Flex, Select, TextField } from '@radix-ui/themes';
import { type ReactNode, useActionState } from 'react';

import { FormField } from '~/shared/ui/form-field';

import type { TaskCategory } from '../model/task-category';

export type TaskCategoryFormState = { isSuccess: boolean } & Partial<Omit<TaskCategory, 'id'>>;

export type TaskCategoryFormProps = {
    action: (prevState: TaskCategoryFormState, formData: FormData) => Promise<TaskCategoryFormState>;
    end?: ReactNode;
    taskCategory?: TaskCategory;
};

export function TaskCategoryForm({ action, end, taskCategory }: TaskCategoryFormProps) {
    const [state, dispatch] = useActionState(action, { isSuccess: true });

    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <FormField error={state.name} label="Название">
                    <TextField.Root
                        defaultValue={taskCategory?.name}
                        name="name"
                        placeholder="Муниципальное учреждение"
                    />
                </FormField>
                <FormField error={state.color} label="Цвет категории">
                    <Select.Root defaultValue={taskCategory?.color ?? 'red'} name="color">
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
                </FormField>
                {end}
            </form>
        </Flex>
    );
}
