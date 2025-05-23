import { type ReactNode, useActionState, useCallback, useState } from 'react';
import { Flex, TextArea } from '@radix-ui/themes';

import type { TaskName } from '~/entities/task-names';
import { TaskNamesSelector } from '~/entities/task-names';
import type { TaskCategory } from '~/entities/task-categories/';
import { TaskCategoriesSelector } from '~/entities/task-categories';

import { FormField } from '~/shared/ui/form-field';
import { ClearableTextField } from '~/shared/ui/clearable-text-field';
import { IdentifierList } from '~/shared/ui/identifier-list';

import { useNumberMask } from '../lib/use-number-mask';
import type { TaskDraft } from '../model/task-draft';

import { TaskDangerStatusSelector } from './task-danger-status-selector.ui';

export type TaskFormValues = {
    unmaskedNumber?: string;
    maskedNumber?: string;
    name?: TaskName;
    category?: TaskCategory;
    description?: string;
    dangerStatus?: string;
    cve: string[];
    bdu: string[];
};

export type TaskFormErrors = {
    number?: string;
    name?: string;
    category?: string;
    description?: string;
    dangerStatus?: string;
    cve?: string;
    bdu?: string;
};

export type TaskFormProps = {
    action?: (values: TaskFormValues) => Promise<TaskFormErrors> | TaskFormErrors;
    task?: TaskDraft;
    end?: ReactNode;
};

export function TaskForm({ action, task, end }: TaskFormProps) {
    const [identifiers, setIdentifiers] = useState({
        cve: task?.cve ?? [],
        bdu: task?.bdu ?? []
    });

    const [formMeta, setFormMeta] = useState({
        name: task?.name,
        category: task?.category,
        dangerStatus: task?.dangerStatus
    });

    const {
        ref,
        unmaskedValue: unmaskedNumber,
        value: maskedNumber,
        setValue: setName
    } = useNumberMask({ defaultValue: task?.number });

    const submit = async (prev: TaskFormErrors, formData: FormData): Promise<TaskFormErrors> => {
        if (!action) return prev;
        return action({
            unmaskedNumber,
            maskedNumber,
            name: formMeta.name,
            category: formMeta.category,
            dangerStatus: formMeta.dangerStatus,
            description: formData.get('description') as string,
            cve: identifiers.cve,
            bdu: identifiers.bdu
        });
    };

    const [state, dispatch] = useActionState(submit, {});

    const handleIdentifierChange = useCallback((type: 'cve' | 'bdu', value: string, action: 'add' | 'remove') => {
        setIdentifiers((prev) => {
            const updated = new Set(prev[type]);
            if (action === 'add') {
                updated.add(value);
            } else {
                updated.delete(value);
            }
            return { ...prev, [type]: Array.from(updated) };
        });
    }, []);

    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <Flex gap="2" justify="between" width="100%">
                    <FormField error={state.number} label="Номер">
                        <ClearableTextField
                            name="number"
                            ref={ref}
                            onClear={() => {
                                setName('');
                            }}
                        />
                    </FormField>

                    <FormField error={state.name} label="Наименование">
                        <TaskNamesSelector
                            defaultValue={task?.name.id}
                            name="nameId"
                            onChange={(name) => {
                                setFormMeta((prev) => ({ ...prev, name }));
                            }}
                        />
                    </FormField>
                </Flex>

                <Flex gap="4" justify="start" width="100%">
                    <FormField error={state.dangerStatus} label="Уровень опасности">
                        <TaskDangerStatusSelector
                            value={formMeta.dangerStatus}
                            onValueChange={(dangerStatus) => {
                                setFormMeta((prev) => ({ ...prev, dangerStatus }));
                            }}
                        />
                    </FormField>

                    <FormField error={state.category} label="Категория задачи">
                        <TaskCategoriesSelector
                            defaultValue={task?.category.id}
                            name="categoryId"
                            onChange={(category) => {
                                setFormMeta((prev) => ({ ...prev, category }));
                            }}
                        />
                    </FormField>
                </Flex>

                <Flex gap="4" justify="start" width="100%">
                    <IdentifierList
                        label="CVE"
                        maskPattern="CVE-YYYY[-NNNN]"
                        placeholder="CVE-2024-1234"
                        values={identifiers.cve}
                        onAdd={(v) => {
                            handleIdentifierChange('cve', v, 'add');
                        }}
                        onRemove={(v) => {
                            handleIdentifierChange('cve', v, 'remove');
                        }}
                    />

                    <IdentifierList
                        label="BDU"
                        maskPattern="BDU:YYYY[-NNNNN]"
                        placeholder="BDU:2024-12345"
                        values={identifiers.bdu}
                        onAdd={(v) => {
                            handleIdentifierChange('bdu', v, 'add');
                        }}
                        onRemove={(v) => {
                            handleIdentifierChange('bdu', v, 'remove');
                        }}
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
                        defaultValue={task?.additionalInformation ?? ''}
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
