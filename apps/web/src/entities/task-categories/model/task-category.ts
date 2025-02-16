import type { BadgeProps } from '@radix-ui/themes';

export type TaskCategory = {
    id: string;
    name: string;
    color: BadgeProps['color'];
};
