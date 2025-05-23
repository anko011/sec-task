import { axiosInstance, type PaginateOptions } from '~/shared/api';
import useSWR from 'swr';
import { GetPaginatedTaskNamesContract, GetTaskNameContract } from '../api/contracts';

export type TaskNamesFilters = {
    title?: string;
};

export function useTaskNames(filters: TaskNamesFilters, pagination: PaginateOptions) {
    const { data, mutate, isLoading } = useSWR(['/task-names', filters, pagination], async ([url]) => {
        const response = await axiosInstance.get(url, {
            params: { ...pagination, ...filters }
        });
        return GetPaginatedTaskNamesContract.parse(response.data);
    });

    const remove = async (id: string) => {
        await axiosInstance.delete(`/task-names/${id}`);
        await mutate();
    };

    const create = async (data: { title: string }) => {
        const response = await axiosInstance.post(`/task-names`, data);
        await mutate();
        return GetTaskNameContract.parse(response.data);
    };

    const edit = async (id: string, data: { title?: string }) => {
        const response = await axiosInstance.patch(`/task-names/${id}`, data);
        await mutate();
        return GetTaskNameContract.parse(response.data);
    };

    return {
        isLoading,
        data,
        remove,
        create,
        edit
    };
}
