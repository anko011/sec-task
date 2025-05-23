import type { BadgeProps } from '@radix-ui/themes';

import { Role } from './user';

export const rolesMapping: Record<Role, { color: BadgeProps['color']; text: string }> = {
    [Role.Admin]: { color: 'jade', text: 'Администратор' },
    [Role.Assigner]: { color: 'blue', text: 'Исполнитель' },
    [Role.Operator]: { color: 'yellow', text: 'Оператор' },
    [Role.Supervisor]: { color: 'violet', text: 'Руководитель' }
};
