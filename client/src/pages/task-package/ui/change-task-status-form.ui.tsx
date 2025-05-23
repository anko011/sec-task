import { type ReactNode, useActionState } from 'react';
import { TaskStatus } from '~/entities/tasks';
import { Flex, Select, TextArea } from '@radix-ui/themes';
import { FormField } from '~/shared/ui/form-field';

const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
    [TaskStatus.COMPENSATED]: [TaskStatus.IN_PROGRESS],
    [TaskStatus.COMPLETED]: [TaskStatus.IN_PROGRESS],
    [TaskStatus.IN_PROGRESS]: [TaskStatus.COMPLETED, TaskStatus.NO_ACTUAL, TaskStatus.COMPENSATED],
    [TaskStatus.NEW]: [TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED, TaskStatus.COMPENSATED, TaskStatus.NO_ACTUAL],
    [TaskStatus.NO_ACTUAL]: [TaskStatus.IN_PROGRESS]
};

const texts: Record<TaskStatus, string> = {
    [TaskStatus.COMPENSATED]: 'Приняты компенсирующие меры',
    [TaskStatus.COMPLETED]: 'Выполнен',
    [TaskStatus.IN_PROGRESS]: 'В процессе',
    [TaskStatus.NEW]: 'Новый',
    [TaskStatus.NO_ACTUAL]: 'Не актуален'
};

export type ChangeTaskStatusFormValues = {
    status: TaskStatus;
    comment: string;
};

export type ChangeTaskStatusFormErrors = {
    status?: string;
    comment?: string;
};

export type ChangeTaskStatusFormProps = {
    currentStatus: TaskStatus;
    end?: ReactNode;
    action?: (values: ChangeTaskStatusFormValues) => Promise<ChangeTaskStatusFormErrors> | ChangeTaskStatusFormErrors;
};

export function ChangeTaskStatusForm({ currentStatus, action, end }: ChangeTaskStatusFormProps) {
    const submit = (errors: ChangeTaskStatusFormErrors, formData: FormData) => {
        if (!action) return errors;
        return action({
            status: formData.get('status') as TaskStatus,
            comment: formData.get('comment') as string
        });
    };

    const [state, dispatch] = useActionState(submit, {});

    const transitions = allowedTransitions[currentStatus];

    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <FormField error={state.status} label="Статус">
                    <Select.Root name="status" defaultValue={transitions.at(0)}>
                        <Select.Trigger />
                        <Select.Content>
                            {transitions.map((item) => (
                                <Select.Item key={item} value={item}>
                                    {texts[item]}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Root>
                </FormField>

                <FormField error={state.comment} label="Комментарий">
                    <TextArea name="comment" style={{ height: '500px' }} placeholder="Напишите комментарий" />
                </FormField>

                {end}
            </form>
        </Flex>
    );
}
