import { Select } from '@radix-ui/themes';
import { TaskDangerStatus } from '../model/task-danger-status';

export type TaskDangerLevelSelectorProps = Omit<Select.RootProps, 'onValueChange'> & {
    onValueChange?: (value?: TaskDangerStatus) => void;
};

export function TaskDangerStatusSelector({
    onValueChange,
    defaultValue = '-1',
    ...props
}: TaskDangerLevelSelectorProps) {
    const onChange = (value: string) => {
        onValueChange?.(value === '-1' ? undefined : (value as TaskDangerStatus));
    };
    return (
        <Select.Root onValueChange={onChange} defaultValue={defaultValue} {...props}>
            <Select.Trigger />
            <Select.Content>
                <Select.Item value="-1">Не выбрано</Select.Item>
                <Select.Item value={TaskDangerStatus.CRITICAL}>Критический</Select.Item>
                <Select.Item value={TaskDangerStatus.HIGH}>Высокий</Select.Item>
                <Select.Item value={TaskDangerStatus.MEDIUM}>Средний</Select.Item>
                <Select.Item value={TaskDangerStatus.LOW}>Низкий</Select.Item>
            </Select.Content>
        </Select.Root>
    );
}
