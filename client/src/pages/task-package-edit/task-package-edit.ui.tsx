import { Suspense } from 'react';
import { useParams } from 'react-router';

import { TaskPackageForm, updateTaskPackage } from '~/entities/task-packages';
import type { TaskPackageFormState, TaskPackageFormValues } from '~/entities/task-packages/ui/task-package-form.ui';
import { createTask, deleteTask, updateTask } from '~/entities/tasks/api/repository';
import { getFieldErrors } from '~/shared/api';
import { Loader } from '~/shared/ui/loader';

export function EditTaskPackagePage() {
    const { id } = useParams();
    if (id == null) throw new Error('Not valid package ID');

    const action = async ({
        deletedTaskIds,
        tasks,
        ...packageInfo
    }: TaskPackageFormValues): Promise<TaskPackageFormState> => {
        try {
            await Promise.all([
                updateTaskPackage(id, packageInfo),
                ...tasks.map((task) =>
                    'id' in task
                        ? updateTask(id, task.id, {
                              ...task,
                              categoryId: task.category.id,
                              nameId: task.name.id
                          })
                        : createTask(id, {
                              ...task,
                              categoryId: task.category.id,
                              nameId: task.name.id
                          })
                ),
                ...deletedTaskIds.map((taskId) => deleteTask(id, taskId))
            ]);

            return { isSuccess: true };
        } catch (e) {
            return { isSuccess: true, ...getFieldErrors(e) };
        }
    };
    return (
        <Suspense fallback={<Loader style={{ height: '100%' }} />}>
            <TaskPackageForm action={action} taskPackageId={id} />;
        </Suspense>
    );
}
