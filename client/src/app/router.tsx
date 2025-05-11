import { createBrowserRouter, Navigate, Outlet } from 'react-router';

import { UserProvider } from '~/entities/users';
import { AbilityProvider } from '~/features/ability';
import { AuthProvider, ProtectedRoute } from '~/features/auth';
import { ThemeProvider } from '~/features/themes/change';
import { OrganizationTypesPage } from '~/pages/organization-types';
import { OrganizationsPage } from '~/pages/organizations';
import { SignInPage } from '~/pages/sign-in';
import { TaskCategoriesPage } from '~/pages/task-categories';
import { TaskNamesPage } from '~/pages/task-names';
import { TaskPackagePage } from '~/pages/task-package';
import { CreateTaskPackagePage } from '~/pages/task-package-create';
import { EditTaskPackagePage } from '~/pages/task-package-edit';
import { TaskPackagesPage } from '~/pages/task-packages';
import { UsersPage } from '~/pages/users';

import { MainLayout } from './layouts/main-layout';

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
                                element: <CreateTaskPackagePage />,
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
                        </ThemeProvider>
                    </AbilityProvider>
                </AuthProvider>
            </UserProvider>
        )
    }
]);
