import { Flex, TextArea, TextField } from '@radix-ui/themes';
import type { ReactNode, RefObject } from 'react';
import { useActionState, useCallback, useState } from 'react';
import { useIMask } from 'react-imask';

import { TaskCategoriesSelector, type TaskCategory } from '~/entities/task-categories/';
import type { TaskName } from '~/entities/task-names';
import { TaskNamesSelector } from '~/entities/task-names';
import type { TaskDangerStatus } from '~/entities/tasks';
import { DangerLevelSelector } from '~/entities/tasks';
import { FormField } from '~/shared/ui/form-field';

import type { TaskDTO } from '../model/task.dto';
import { IdentifierList } from './identifier-list.ui';

export type TaskFormProps = {
    end?: ReactNode;
    onSuccess?: (task: TaskDTO) => void;
    task?: TaskDTO | null;
};

type TaskFormState = { isSuccess: boolean } & {
    description?: string;
    dangerStatus?: string;
    nameId?: string;
    number?: string;
    taskCategoryId?: string;
};

function action(_: TaskFormState, formData: FormData): TaskFormState {
    const requiredFields = ['nameId', 'number', 'description', 'dangerStatus', 'taskCategoryId'];
    const errors: Record<string, string> = {};

    for (const key of requiredFields) {
        if (key === 'taskCategoryId') {
            if (!formData.has(key) || formData.get(key) === '' || formData.get(key) === '-1') {
                errors[key] = 'Обязательное поле';
            }
        }
        if (!formData.has(key) || formData.get(key) === '') {
            errors[key] = 'Обязательное поле';
        }
    }

    if (Object.keys(errors).length > 0) return { isSuccess: false, ...errors };

    return { isSuccess: true };
}

export function TaskForm({ end, onSuccess, task }: TaskFormProps) {
    const [cveList, setCveList] = useState<string[]>(task?.CVE ?? []);
    const [bduList, setBduList] = useState<string[]>(task?.BDU ?? []);

    const [taskCategory, setTaskCategory] = useState<TaskCategory | undefined>(task?.category);
    const [taskName, setTaskName] = useState<TaskName | undefined>(task?.name);

    const submit = (prev: TaskFormState, formData: FormData) => {
        const state = action(prev, formData);
        if (state.isSuccess) {
            if (taskCategory == null || taskName == null) throw new Error();
            onSuccess?.({
                description: formData.get('description') as string,
                name: taskName,
                additionalInformation: formData.get('additionalInformation') as string,
                BDU: bduList,
                category: taskCategory,
                CVE: cveList,
                dangerStatus: formData.get('dangerStatus') as TaskDangerStatus,
                number: formData.get('number') as string
            });
        }
        return state;
    };

    const [state, dispatch] = useActionState(submit, { isSuccess: true });

    const addCve = useCallback((cve: string) => {
        setCveList((prev) => [...prev, cve]);
    }, []);

    const removeCve = useCallback((value: string) => {
        setCveList((prev) => prev.filter((v) => v !== value));
    }, []);

    const addBdu = useCallback((bdu: string) => {
        setBduList((prev) => [...prev, bdu]);
    }, []);

    const removeBdu = useCallback((value: string) => {
        setBduList((prev) => prev.filter((v) => v !== value));
    }, []);

    const changeCategory = useCallback((category?: TaskCategory) => {
        setTaskCategory(category);
    }, []);

    const { ref: numberRef, value } = useIMask(
        {
            definitions: {
                0: /\d/
            },
            lazy: false,
            mask: '000000',
            overwrite: true,
            placeholderChar: '_'
        },
        {
            defaultValue: task?.number
        }
    );

    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <Flex gap="2" justify="between" width="100%">
                    <FormField error={state.number} label="Номер">
                        <TextField.Root
                            name="number"
                            ref={numberRef as RefObject<HTMLInputElement>}
                            style={{ width: '100%' }}
                            value={value}
                        />
                    </FormField>
                    <FormField error={state.nameId} label="Наименование">
                        <TaskNamesSelector defaultValue={task?.name.id} name="nameId" onChange={setTaskName} />
                    </FormField>
                </Flex>

                <Flex gap="4" justify="start" width="100%">
                    <FormField error={state.dangerStatus} label="Уровень опасности">
                        <DangerLevelSelector defaultValue={task?.dangerStatus} />
                    </FormField>
                    <FormField error={state.taskCategoryId} label="Категория задачи">
                        <TaskCategoriesSelector
                            defaultValue={task?.category.id}
                            name="taskCategoryId"
                            onChange={changeCategory}
                        />
                    </FormField>
                </Flex>

                <Flex gap="4" justify="start" width="100%">
                    <IdentifierList
                        label="CVE"
                        maskPattern="CVE-YYYY[-NNNN]"
                        onAdd={addCve}
                        onRemove={removeCve}
                        placeholder="CVE-2024-1234"
                        values={cveList}
                    />

                    <IdentifierList
                        label="BDU"
                        maskPattern="BDU:YYYY[-NNNNN]"
                        onAdd={addBdu}
                        onRemove={removeBdu}
                        placeholder="BDU:2024-12345"
                        values={bduList}
                    />
                </Flex>

                <FormField error={state.description} label="Описание задачи">
                    <TextArea
                        defaultValue={task?.description}
                        name="description"
                        placeholder="Введите описание задачи..."
                        style={{ height: '300px' }}
                    />
                </FormField>

                <FormField label="Дополнительная информация">
                    <TextArea
                        defaultValue={task?.additionalInformation}
                        name="additionalInformation"
                        placeholder="Введите дополнительную информацию..."
                        style={{ height: '150px' }}
                    />
                </FormField>
                {end}
            </form>
        </Flex>
    );
}
