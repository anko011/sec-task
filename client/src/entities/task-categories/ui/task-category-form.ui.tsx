import { type BadgeProps, Flex, TextField } from '@radix-ui/themes';
import { type ReactNode, useActionState, useState } from 'react';

import { FormField } from '~/shared/ui/form-field';

import type { TaskCategory } from '../model/task-category';
import { ColorPicker } from '~/shared/ui/color-picker';

export type TaskCategoryFormValues = {
    title?: string;
    color?: BadgeProps['color'];
};

export type TaskCategoryFormErrors = {
    title?: string;
    color?: string;
};

export type TaskCategoryFormProps = {
    action?: (values: TaskCategoryFormValues) => Promise<TaskCategoryFormErrors> | TaskCategoryFormErrors;
    end?: ReactNode;
    taskCategory?: TaskCategory;
};

export function TaskCategoryForm({ action, end, taskCategory }: TaskCategoryFormProps) {
    const [color, setColor] = useState(taskCategory?.color);

    const submit = async (errors: TaskCategoryFormErrors, formData: FormData) => {
        if (!action) return errors;
        return action({
            title: formData.get('title') as string,
            color: color as BadgeProps['color']
        });
    };

    const [errors, dispatch] = useActionState(submit, {});

    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <FormField error={errors.title} label="Название">
                    <TextField.Root
                        defaultValue={taskCategory?.title}
                        name="title"
                        placeholder="Муниципальное учреждение"
                    />
                </FormField>
                <FormField error={errors.color} label="Цвет категории">
                    <ColorPicker color={color} onChange={setColor} />
                </FormField>
                {end}
            </form>
        </Flex>
    );
}
