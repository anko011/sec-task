import type { z } from 'zod';
import useSWR from 'swr';

import { axiosInstance, type PaginateOptions } from '~/shared/api';

import type { TaskPackageStatus } from './task-package-status';
import {
    type CreateTaskPackageContract,
    type EditTaskPackageContract,
    GetPaginatedTaskPackageContract,
    GetTaskPackageContract
} from '../api/contracts';
import { Role, useCurrentUser } from '~/entities/users';

export type TaskPackageFilters = {
    incomingRequisite?: string;
    outgoingRequisite?: string;
    status?: TaskPackageStatus;
};

export type CreateTaskPackageDto = z.infer<typeof CreateTaskPackageContract>;
export type EditTaskPackageDto = z.infer<typeof EditTaskPackageContract>;

export function useTaskPackages(
    filters: TaskPackageFilters = {},
    pagination: PaginateOptions = {
        limit: 10,
        offset: 0
    }
) {
    const { user } = useCurrentUser();
    const { data, mutate, isLoading } = useSWR(
        ['/task-packages', pagination, filters],
        async ([url, pagination, filters]) => {
            const response = await axiosInstance.get<unknown>(url, {
                params: {
                    ...pagination,
                    ...filters,
                    scope: user?.role === Role.Assigner ? 'organization' : 'all'
                }
            });
            return GetPaginatedTaskPackageContract.parse(response.data);
        }
    );

    return {
        isLoading,
        data,
        filters,
        remove: async (id: string) => {
            await axiosInstance.delete<unknown>(`/task-packages/${id}`);
            await mutate();
        },
        create: async (data: CreateTaskPackageDto) => {
            const response = await axiosInstance.post(`/task-packages`, data);
            await mutate();
            return GetTaskPackageContract.parse(response.data);
        },
        edit: async (id: string, data: EditTaskPackageDto) => {
            const response = await axiosInstance.patch(`/task-packages/${id}`, data);
            await mutate();
            return GetTaskPackageContract.parse(response.data);
        },
        fix: async (id: string) => {
            await axiosInstance.post(`/task-packages/${id}/fix`);
            await mutate();
        }
    };
}
