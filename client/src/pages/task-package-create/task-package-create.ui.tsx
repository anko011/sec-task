import { Suspense } from 'react';

import { createTaskPackage, TaskPackageForm } from '~/entities/task-packages';
import { createTask } from '~/entities/tasks/api/repository';
import { getFieldErrors } from '~/shared/api';
import { Loader } from '~/shared/ui/loader';

import type { TaskPackageFormState, TaskPackageFormValues } from '../../entities/task-packages/ui/task-package-form.ui';

export function CreateTaskPackagePage() {
    const action = async (data: TaskPackageFormValues): Promise<TaskPackageFormState> => {
        try {
            const taskPackage = await createTaskPackage(data);
            await Promise.all(
                data.tasks.map((task) =>
                    createTask(taskPackage.id, {
                        ...task,
                        categoryId: task.category.id,
                        nameId: task.name.id
                    })
                )
            );

            return { isSuccess: true };
        } catch (e) {
            return { isSuccess: false, ...getFieldErrors(e) };
        }
    };
    return (
        <Suspense fallback={<Loader />}>
            <TaskPackageForm action={action} />
        </Suspense>
    );
}
