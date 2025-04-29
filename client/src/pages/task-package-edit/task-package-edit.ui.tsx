import { Suspense } from 'react';
import { useParams } from 'react-router';

import { TaskPackageForm, TaskPackagesRepository } from '~/entities/task-packages';
import { Loader } from '~/shared/ui/loader';

export function EditTaskPackagePage() {
    const { id } = useParams();
    if (id == null) throw new Error('Not valid package ID');

    const taskPackage = TaskPackagesRepository.getById(id);

    return (
        <Suspense fallback={<Loader style={{ height: '100%' }} />}>
            <TaskPackageForm data={taskPackage} />;
        </Suspense>
    );
}
