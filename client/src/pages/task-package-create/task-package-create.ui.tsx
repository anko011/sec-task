import { Suspense } from 'react';

import { TaskPackageForm } from '~/entities/task-packages';
import { Loader } from '~/shared/ui/loader';

export function CreateTaskPackagePage() {
    return (
        <Suspense fallback={<Loader />}>
            <TaskPackageForm />
        </Suspense>
    );
}
