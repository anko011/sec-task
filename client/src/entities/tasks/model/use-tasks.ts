import useSWR from 'swr';

import { axiosInstance, type PaginateOptions } from '~/shared/api';

import { GetPaginatedTasksContract } from '../api/contracts';
import type { TaskDangerStatus } from './task-danger-status';

export type TaskFilters = {
    number?: string;
    nameId?: string;
    categoryId?: string;
    dangerStatus?: TaskDangerStatus;
};

export function useTasks(
    taskPackageId: string,
    filters: TaskFilters = {},
    pagination: PaginateOptions = {
        limit: 10,
        offset: 0
    }
) {
    return useSWR(
        [`/task-packages/${taskPackageId}/tasks`, filters, pagination],
        async ([url, filters, pagination]) => {
            const response = await axiosInstance.get(url, {
                params: { ...pagination, ...filters }
            });
            return GetPaginatedTasksContract.parse(response.data);
        }
    );
}
