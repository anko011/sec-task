import { createBrowserRouter, Navigate, Outlet } from 'react-router';

import { UserProvider } from '~/entities/users';
import { AbilityProvider } from '~/features/ability';
import { AuthProvider, ProtectedRoute } from '~/features/auth';
import { ThemeProvider } from '~/features/themes/change';
import { MainLayout } from './layouts/main-layout';
import { ToastContainer } from 'react-toastify';
import { lazy, Suspense } from 'react';

const SignInPage = lazy(async () => import('~/pages/sign-in/sign-in.page'));

const OrganizationTypesPage = lazy(async () => import('~/pages/organization-types/organization-types.page'));
const OrganizationsPage = lazy(async () => import('~/pages/organizations/organizations.page'));

const TaskCategoriesPage = lazy(async () => import('~/pages/task-categories/task-categories-page.ui'));
const TaskNamesPage = lazy(async () => import('~/pages/task-names/task-names.page'));

const TaskPackagePage = lazy(async () => import('~/pages/task-package/task-package.page'));
const CreateTaskPackagePage = lazy(async () => import('~/pages/task-package-create/task-package-create.ui'));
const EditTaskPackagePage = lazy(async () => import('~/pages/task-package-edit/task-package-edit.ui'));
const TaskPackagesPage = lazy(async () => import('~/pages/task-packages'));

const UsersPage = lazy(async () => import('~/pages/users/users.page'));

export const router = createBrowserRouter([
    {
        children: [
            {
                children: [
                    {
                        element: <Navigate replace to="/task-packages" />,
                        index: true
                    },
                    {
                        element: <UsersPage />,
                        path: 'users'
                    },
                    {
                        element: <OrganizationsPage />,
                        path: 'organizations'
                    },
                    {
                        element: <OrganizationTypesPage />,
                        path: 'organization-types'
                    },
                    {
                        element: <TaskNamesPage />,
                        path: 'task-names'
                    },
                    {
                        children: [
                            {
                                element: <TaskPackagesPage />,
                                index: true
                            },
                            {
                                children: [
                                    {
                                        element: <TaskPackagePage />,
                                        index: true
                                    },
                                    {
                                        element: <EditTaskPackagePage />,
                                        path: 'edit'
                                    }
                                ],
                                path: ':id'
                            },
                            {
                                element: (
                                    <Suspense>
                                        <CreateTaskPackagePage />
                                    </Suspense>
                                ),
                                path: 'create'
                            }
                        ],
                        path: 'task-packages'
                    },
                    {
                        element: <TaskCategoriesPage />,
                        path: 'task-categories'
                    },
                    {
                        element: <Navigate replace to="/task-packages" />,
                        path: '*'
                    }
                ],
                element: (
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                ),
                path: '/'
            },
            {
                element: <SignInPage />,
                path: 'sign-in'
            },
            {
                element: <Navigate replace to="/task-packages" />,
                path: '*'
            }
        ],
        element: (
            <UserProvider>
                <AuthProvider>
                    <AbilityProvider>
                        <ThemeProvider>
                            <Outlet />
                            <ToastContainer stacked position="bottom-right" />
                        </ThemeProvider>
                    </AbilityProvider>
                </AuthProvider>
            </UserProvider>
        )
    }
]);
