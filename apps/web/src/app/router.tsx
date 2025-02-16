import { Text } from '@radix-ui/themes';
import { Navigate, Route, Routes } from 'react-router';

import { OrganizationTypesPage } from '~/pages/organization-types';
import { OrganizationsPage } from '~/pages/organizations';
import { TaskPage } from '~/pages/task';
import { TaskCategoriesPage } from '~/pages/task-categories';
import { TaskPackagePage } from '~/pages/task-package';
import { CreateTaskPackagePage } from '~/pages/task-package-create';
import { EditTaskPackagePage } from '~/pages/task-package-edit';
import { TaskPackagesPage } from '~/pages/task-packages';

import { MainLayout } from './layouts/main-layout';

export function ApplicationRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route element={<Navigate to="/task-packages" />} index />
                <Route element={<OrganizationsPage />} path="organizations" />
                <Route element={<OrganizationTypesPage />} path="organization-types" />
                <Route path="task-packages">
                    <Route element={<TaskPackagesPage />} index />
                    <Route path=":id">
                        <Route element={<TaskPackagePage />} index />
                        <Route element={<TaskPage />} path="tasks/:taskId" />
                        <Route element={<EditTaskPackagePage />} path="edit" />
                    </Route>
                    <Route element={<CreateTaskPackagePage />} path="create" />
                </Route>
                <Route element={<TaskCategoriesPage />} path="task-categories" />
                <Route element={<Text>Not implemented</Text>} path="staff" />
                <Route element={<Text>Not implemented</Text>} path="roles" />
            </Route>
        </Routes>
    );
}
