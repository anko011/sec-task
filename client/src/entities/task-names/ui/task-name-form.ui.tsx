import { Flex, TextField } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { useActionState } from 'react';

import { FormField } from '~/shared/ui/form-field';

import type { TaskName } from '../model/task-name';

export type TaskNameFormErrors = {
    title?: string;
};

export type TaskNameFormValues = {
    title?: string;
};

export type TaskNameFormProps = {
    action?: (values: TaskNameFormValues) => Promise<TaskNameFormErrors> | TaskNameFormErrors;
    end?: ReactNode;
    taskName?: TaskName;
};

export function TaskNameForm({ action, end, taskName }: TaskNameFormProps) {
    const submit = async (prev: TaskNameFormErrors, formData: FormData): Promise<TaskNameFormErrors> => {
        if (!action) return prev;
        return action({
            title: formData.get('title') as string
        });
    };

    const [state, dispatch] = useActionState(submit, {});
    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <FormField error={state.title} label="Наименование">
                    <TextField.Root defaultValue={taskName?.title} name="title" placeholder="Корректировка реестра" />
                </FormField>
                {end}
            </form>
        </Flex>
    );
}
