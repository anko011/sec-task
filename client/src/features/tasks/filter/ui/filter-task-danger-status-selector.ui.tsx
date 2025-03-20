import { Flex, Select, Text } from '@radix-ui/themes';

import { TaskDangerStatus } from '~/entities/tasks';

export function FilterTaskDangerStatusSelector() {
    return (
        <Flex align="center" asChild gap="2">
            <label>
                <Text size="2">Категория задачи</Text>
                <Select.Root defaultValue="-1">
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Item value="-1">Не выбрано</Select.Item>
                        <Select.Item value={TaskDangerStatus.CRITICAL}>Критический</Select.Item>
                        <Select.Item value={TaskDangerStatus.HIGH}>Высокий</Select.Item>
                        <Select.Item value={TaskDangerStatus.MEDIUM}>Средний</Select.Item>
                        <Select.Item value={TaskDangerStatus.LOW}>Низкий</Select.Item>
                    </Select.Content>
                </Select.Root>
            </label>
        </Flex>
    );
}
