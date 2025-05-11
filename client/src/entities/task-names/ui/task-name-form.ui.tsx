import { Flex, TextField } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { useActionState } from 'react';

import { FormField } from '~/shared/ui/form-field';

import type { TaskName } from '../model';

export type TaskNameFormState = { isSuccess: boolean } & Partial<Omit<TaskName, 'id'>>;

type TaskNameFormProps = {
    action: (prevState: TaskNameFormState, formData: FormData) => Promise<TaskNameFormState>;
    end?: ReactNode;
    taskName?: TaskName;
};

export function TaskNameForm({ action, end, taskName }: TaskNameFormProps) {
    const [state, dispatch] = useActionState(action, { isSuccess: true });
    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <FormField error={state.name} label="Название">
                    <TextField.Root defaultValue={taskName?.name} name="name" placeholder="Корректировка реестра" />
                </FormField>
                {end}
            </form>
        </Flex>
    );
}
