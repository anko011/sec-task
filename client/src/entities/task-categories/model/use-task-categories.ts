import type { z } from 'zod';
import useSWR from 'swr';

import { axiosInstance, type PaginateOptions } from '~/shared/api';

import {
    type CreateTaskCategoryContract,
    type EditTaskCategoryContract,
    GetPaginatedTaskCategoriesContract,
    GetTaskCategoryContract
} from '../api/contracts';

type CreateTaskCategoryDto = z.infer<typeof CreateTaskCategoryContract>;
type EditTaskCategoryDto = z.infer<typeof EditTaskCategoryContract>;

export type TaskCategoriesFilters = {
    title?: string;
    color?: string;
};

export function useTaskCategories(filters: TaskCategoriesFilters, pagination: PaginateOptions) {
    const { data, mutate, isLoading } = useSWR(
        ['/task-categories', filters, pagination],
        async ([url, filters, pagination]) => {
            const response = await axiosInstance.get(url, {
                params: { ...pagination, ...filters }
            });
            return GetPaginatedTaskCategoriesContract.parse(response.data);
        }
    );

    const remove = async (id: string) => {
        await axiosInstance.delete(`/task-categories/${id}`);
        await mutate();
    };

    const create = async (data: CreateTaskCategoryDto) => {
        const response = await axiosInstance.post(`/task-categories`, data);
        await mutate();
        return GetTaskCategoryContract.parse(response.data);
    };

    const edit = async (id: string, data: EditTaskCategoryDto) => {
        const response = await axiosInstance.patch(`/task-categories/${id}`, data);
        await mutate();
        return GetTaskCategoryContract.parse(response.data);
    };

    return {
        isLoading,
        data,
        revalidate: mutate,
        remove,
        create,
        edit
    };
}
