import type { BadgeProps } from '@radix-ui/themes';
import { Badge } from '@radix-ui/themes';

import { TaskStatus } from '~/entities/tasks';

const taskStatusesMap: Record<TaskStatus, { color: BadgeProps['color']; text: string }> = {
    [TaskStatus.COMPENSATED]: { color: 'green', text: 'Приняты компенсирующие меры' },
    [TaskStatus.COMPLETED]: { color: 'green', text: 'Выполнен' },
    [TaskStatus.IN_PROGRESS]: { color: 'yellow', text: 'В процессе' },
    [TaskStatus.NEW]: { color: 'blue', text: 'Новый' },
    [TaskStatus.NO_ACTUAL]: { color: 'green', text: 'Не актуален' }
};

export type TaskStatusBadgeProps = BadgeProps & {
    status: TaskStatus;
};

export function TaskStatusBadge({ status, ...props }: TaskStatusBadgeProps) {
    const { color, text } = taskStatusesMap[status];
    return (
        <Badge color={color} {...props}>
            {text}
        </Badge>
    );
}
