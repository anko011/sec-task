import useSWR from 'swr';
import { GetPaginatedTasksContract } from '~/entities/tasks';
import { axiosInstance } from '~/shared/api';

import { GetTaskPackageContract } from '../api/contracts';

export function useTaskPackage(packageId: string) {
    return useSWR(`/task-packages/${packageId}`, async (url) => {
        const [taskPackageResponse, tasksResponse] = await Promise.all([
            axiosInstance.get(url),
            axiosInstance.get(`${url}/tasks`, {
                params: {
                    limit: 10_000,
                    offset: 0
                }
            })
        ]);

        const taskPackage = GetTaskPackageContract.parse(taskPackageResponse.data);
        const tasks = GetPaginatedTasksContract.parse(tasksResponse.data).items;

        return { ...taskPackage, tasks };
    });
}
