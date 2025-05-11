import { Badge } from '@radix-ui/themes';

import type { Role } from '../model';
import { rolesMapping } from '../model';

export function UserRoleBadge({ role }: { role: Role }) {
    const { color, text } = rolesMapping[role];
    return <Badge color={color}>{text}</Badge>;
}
