import { Flex, Select, Text } from '@radix-ui/themes';

import { TaskPackageStatus } from '~/entities/task-packages';

export type FilterTaskPackagesStatusSelectorProps = {
    onChange?: (status?: TaskPackageStatus) => void;
};

export function FilterTaskPackagesStatusSelector({ onChange }: FilterTaskPackagesStatusSelectorProps) {
    const handleChangeStatus = (value: TaskPackageStatus | '-1') => {
        onChange?.(value === '-1' ? undefined : value);
    };

    return (
        <Flex align="center" asChild gap="2">
            <label>
                <Text size="2">Статус пакета</Text>
                <Select.Root defaultValue="-1" onValueChange={handleChangeStatus}>
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Item value="-1">Не выбрано</Select.Item>
                        <Select.Item value={TaskPackageStatus.ACTIVE}>Активен</Select.Item>
                        <Select.Item value={TaskPackageStatus.FIXED}>Зафиксирован</Select.Item>
                    </Select.Content>
                </Select.Root>
            </label>
        </Flex>
    );
}
