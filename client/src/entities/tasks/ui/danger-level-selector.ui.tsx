import { Select } from '@radix-ui/themes';

import { TaskDangerStatus } from '~/entities/tasks';

export const DangerLevelSelector = ({ defaultValue }: { defaultValue?: TaskDangerStatus }) => (
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