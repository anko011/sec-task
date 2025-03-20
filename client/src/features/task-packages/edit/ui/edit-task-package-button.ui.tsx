import { Pencil1Icon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';

import type { TaskPackage } from '~/entities/task-packages';
import { Link } from '~/shared/ui/link';

export type EditTaskPackageButtonProps = {
    taskPackage: TaskPackage;
};

export function EditTaskPackageButton({ taskPackage }: EditTaskPackageButtonProps) {
    return (
        <Link asChild to={`${taskPackage.id}/edit`}>
            <IconButton highContrast>
                <Pencil1Icon />
            </IconButton>
        </Link>
    );
}
