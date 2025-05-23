import { toast } from 'react-toastify';

import {
    CreateTaskPackageButton,
    DeleteTaskPackageButton,
    EditTaskPackageButton,
    FixTaskPackageButton
} from '~/features/task-packages';
import { type TaskPackage, TaskPackageView, TaskPackageViewContext } from '~/entities/task-packages';
import { useStrictContext } from '~/shared/lib';

function Delete({ taskPackage }: { taskPackage: TaskPackage }) {
    const { remove } = useStrictContext(TaskPackageViewContext);

    const handleDelete = async () => {
        try {
            await remove(taskPackage.id);
            toast.success(`Пакет задач ${taskPackage.outgoingRequisite} успешно удален`);
        } catch {
            toast.error('Не удалось удалить пакет задач');
        }
    };

    return <DeleteTaskPackageButton taskPackage={taskPackage} action={handleDelete} />;
}

function Create() {
    return <CreateTaskPackageButton />;
}

function Edit({ taskPackage }: { taskPackage: TaskPackage }) {
    return <EditTaskPackageButton taskPackage={taskPackage} />;
}

function Fix({ taskPackage }: { taskPackage: TaskPackage }) {
    const { fix } = useStrictContext(TaskPackageViewContext);

    const action = async () => {
        try {
            await fix(taskPackage.id);
            toast.success(`Пакет задач ${taskPackage.outgoingRequisite} успешно зафиксирован`);
        } catch {
            toast.error('Не удалось зафиксировать пакет задач');
        }
    };
    return <FixTaskPackageButton taskPackage={taskPackage} action={action} />;
}

export const TaskPackageBuilder = {
    ...TaskPackageView,
    Delete,
    Create,
    Edit,
    Fix
};
