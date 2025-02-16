import { PlusIcon } from '@radix-ui/react-icons';
import type { IconButtonProps } from '@radix-ui/themes';
import { IconButton, Tooltip } from '@radix-ui/themes';

import { Link } from '~/shared/ui/link';

export type CreateTaskPackageButtonProps = IconButtonProps & {};

export function CreateTaskPackageButton({ ...props }: CreateTaskPackageButtonProps) {
    return (
        <Tooltip content="Создать пакет задач">
            <Link asChild to="/task-packages/create">
                <IconButton highContrast {...props}>
                    <PlusIcon />
                </IconButton>
            </Link>
        </Tooltip>
    );
}
