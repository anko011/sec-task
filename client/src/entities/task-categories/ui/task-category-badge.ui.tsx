import type { BadgeProps } from '@radix-ui/themes';
import { Badge } from '@radix-ui/themes';

import type { TaskCategory } from '../model/task-category';

export type TaskCategoryBadgeProps = BadgeProps & {
    category: TaskCategory;
};

export function TaskCategoryBadge({ category, ...props }: TaskCategoryBadgeProps) {
    return (
        <Badge color={category.color as BadgeProps['color']} {...props}>
            {category.title}
        </Badge>
    );
}
