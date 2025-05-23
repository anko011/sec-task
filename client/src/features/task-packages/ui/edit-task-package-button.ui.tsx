import { Pencil1Icon } from '@radix-ui/react-icons';
import { IconButton, Tooltip } from '@radix-ui/themes';

import { type TaskPackage, TaskPackageStatus } from '~/entities/task-packages';
import { Link } from '~/shared/ui/link';

export type EditTaskPackageButtonProps = {
    taskPackage: TaskPackage;
};

export function EditTaskPackageButton({ taskPackage }: EditTaskPackageButtonProps) {
    const isFixed = taskPackage.status === TaskPackageStatus.FIXED;

    return (
        <Tooltip
            content={isFixed ? 'Пакет задач зафиксирован, редактирование недоступно' : 'Редактировать пакет задач'}
        >
            <Link asChild to={`${taskPackage.id}/edit`}>
                <IconButton highContrast disabled={isFixed}>
                    <Pencil1Icon />
                </IconButton>
            </Link>
        </Tooltip>
    );
}
