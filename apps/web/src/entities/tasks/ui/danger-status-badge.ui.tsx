import type { BadgeProps } from '@radix-ui/themes';
import { Badge } from '@radix-ui/themes';

import { TaskDangerStatus } from '~/entities/tasks';

const dangerBadges = {
    [TaskDangerStatus.CRITICAL]: { color: 'red', text: 'Критический' },
    [TaskDangerStatus.HIGH]: { color: 'orange', text: 'Высокий' },
    [TaskDangerStatus.LOW]: { color: 'blue', text: 'Низкий' },
    [TaskDangerStatus.MEDIUM]: { color: 'yellow', text: 'Средний' }
} as const;

export type TaskDangerStatusBadgeProps = BadgeProps & {
    status: TaskDangerStatus;
};

export function TaskDangerStatusBadge({ status, ...props }: TaskDangerStatusBadgeProps) {
    const { color, text } = dangerBadges[status];
    return (
        <Badge color={color} {...props}>
            {text}
        </Badge>
    );
}
