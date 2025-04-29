import { PlusIcon } from '@radix-ui/react-icons';
import { Box, Flex, IconButton, Select, Text, TextArea, TextField } from '@radix-ui/themes';
import type { KeyboardEventHandler } from 'react';
import { useCallback, useRef, useState } from 'react';

import { TaskCategoriesSelector, type TaskCategory } from '~/entities/task-categories/@x/tasks';

import { TaskDangerStatus } from '../model/task';
import type { TaskDTO } from '../model/task.dto';
import { BDUBadge } from './bdu-badge.ui';

export type TaskFormProps = {
    formId: string;
    onSubmit?: (task: TaskDTO) => void;
    task?: TaskDTO | null;
};

type IdentifierListProps = {
    label: string;
    onAdd: (value: string) => void;
    onRemove: (value: string) => void;
    placeholder: string;
    values: string[];
};

const IdentifierList = ({ label, onAdd, onRemove, placeholder, values }: IdentifierListProps) => {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = useCallback(() => {
        if (inputValue.trim() !== '') {
            onAdd(inputValue.trim());
            setInputValue('');
        }
    }, [inputValue, onAdd]);

    const handleKeyDown = useCallback<KeyboardEventHandler>(
        (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
            }
        },
        [handleAdd]
    );

    return (
        <Box flexGrow="1" maxWidth="50%">
            <label>
                <Text as="div" mb="1" size="2" weight="bold">
                    {label}
                </Text>
                <Flex gap="2">
                    <TextField.Root
                        onChange={(e) => {
                            setInputValue(e.target.value);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        style={{ flex: 1 }}
                        value={inputValue}
                    />
                    <IconButton onClick={handleAdd} type="button">
                        <PlusIcon />
                    </IconButton>
                </Flex>
            </label>
            <Flex gap="2" p="1" wrap="wrap">
                {values.map((value, index) => (
                    <BDUBadge
                        key={`${value}:${index.toString()}`}
                        onDelete={(value) => {
                            onRemove(value);
                        }}
                    >
                        {value}
                    </BDUBadge>
                ))}
            </Flex>
        </Box>
    );
};

const DangerLevelSelector = ({ defaultValue }: { defaultValue?: TaskDangerStatus }) => (
    <Select.Root defaultValue={defaultValue ?? TaskDangerStatus.CRITICAL} name="dangerStatus">
        <Select.Trigger style={{ width: '100%' }} />
        <Select.Content>
            <Select.Item value={TaskDangerStatus.CRITICAL}>Критический</Select.Item>
            <Select.Item value={TaskDangerStatus.HIGH}>Высокий</Select.Item>
            <Select.Item value={TaskDangerStatus.MEDIUM}>Средний</Select.Item>
            <Select.Item value={TaskDangerStatus.LOW}>Низкий</Select.Item>
        </Select.Content>
    </Select.Root>
);

export function TaskForm({ formId, onSubmit, task }: TaskFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [cveList, setCveList] = useState<string[]>(task?.CVE ?? []);
    const [bduList, setBduList] = useState<string[]>(task?.BDU ?? []);
    const [taskCategory, setTaskCategory] = useState<TaskCategory | undefined>(task?.category);

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

    const submit = useCallback(
        (formData: FormData) => {
            const name = formData.get('name') as string;
            const number = formData.get('number') as string;
            const description = formData.get('description') as string;
            const dangerStatus = formData.get('dangerStatus') as TaskDangerStatus;
            const additionalInformation = formData.get('additionalInformation') as string;

            if (taskCategory == null) return;

            onSubmit?.({
                description,
                name,
                additionalInformation,
                BDU: bduList,
                category: taskCategory,
                CVE: cveList,
                dangerStatus,
                number: task?.number ?? number
            });

            formRef.current?.reset();
        },
        [onSubmit, bduList, cveList, task?.number]
    );

    return (
        <Flex asChild direction="column" gap="4">
            <form action={submit} id={formId} ref={formRef}>
                <Flex gap="2" justify="between" width="100%">
                    <Box asChild flexGrow="1">
                        <label>
                            <Text as="div" mb="1" size="2" weight="bold">
                                Номер
                            </Text>
                            <TextField.Root
                                defaultValue={task?.number}
                                name="number"
                                placeholder="Введите номер задачи..."
                                style={{ width: '100%' }}
                            />
                        </label>
                    </Box>
                    <Box asChild flexGrow="3">
                        <label>
                            <Text as="div" mb="1" size="2" weight="bold">
                                Наименование
                            </Text>
                            <TextField.Root
                                defaultValue={task?.name}
                                name="name"
                                placeholder="Введите название задачи..."
                                style={{ width: '100%' }}
                            />
                        </label>
                    </Box>
                </Flex>

                <Flex gap="4" justify="start" width="100%">
                    <label>
                        <Text as="div" mb="1" size="2" weight="bold">
                            Уровень опасности
                        </Text>
                        <DangerLevelSelector defaultValue={task?.dangerStatus} />
                    </label>

                    <label>
                        <Text as="div" mb="1" size="2" weight="bold">
                            Категория задачи
                        </Text>
                        <TaskCategoriesSelector defaultValue={task?.category.id} onChange={changeCategory} />
                    </label>
                </Flex>

                <Flex gap="4" justify="start" width="100%">
                    <IdentifierList
                        label="CVE"
                        onAdd={addCve}
                        onRemove={removeCve}
                        placeholder="Введите CVE (например, CVE-2021-34527)"
                        values={cveList}
                    />

                    <IdentifierList
                        label="BDU"
                        onAdd={addBdu}
                        onRemove={removeBdu}
                        placeholder="Введите BDU (например, BDU:2025-04927)"
                        values={bduList}
                    />
                </Flex>

                <label>
                    <Text as="div" mb="1" size="2" weight="bold">
                        Описание задачи
                    </Text>
                    <TextArea
                        defaultValue={task?.description}
                        name="description"
                        placeholder="Введите описание задачи..."
                        style={{ height: '350px' }}
                    />
                </label>

                <label>
                    <Text as="div" mb="1" size="2" weight="bold">
                        Дополнительная информация
                    </Text>
                    <TextArea
                        defaultValue={task?.additionalInformation}
                        name="additionalInformation"
                        placeholder="Введите дополнительную информацию..."
                        style={{ height: '150px' }}
                    />
                </label>
            </form>
        </Flex>
    );
}
