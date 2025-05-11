import { assert } from 'superstruct';

import type { Organization } from '~/entities/organizations';
import type { Paginated } from '~/shared/api';
import { axiosInstance } from '~/shared/api';

import type { TaskCategory } from '../model';
import { GetPaginatedTaskCategoriesContract } from './contracts';

export async function findAllTaskCategories(
    params?: URLSearchParams,
    abort?: AbortController
): Promise<Paginated<TaskCategory>> {
    const { data } = await axiosInstance.get<unknown>('task-categories', { params, signal: abort?.signal });
    assert(data, GetPaginatedTaskCategoriesContract);
    return data as Paginated<TaskCategory>;
}

export async function createTaskCategory(data: Record<string, FormDataEntryValue>, abort?: AbortController) {
    const response = await axiosInstance.post<TaskCategory>('task-categories', data, { signal: abort?.signal });
    return response.data;
}

export async function updateTaskCategory(
    taskCategoryId: string,
    data: Record<string, FormDataEntryValue>,
    abort?: AbortController
) {
    const response = await axiosInstance.patch<Organization>(`task-categories/${taskCategoryId}`, data, {
        signal: abort?.signal
    });
    return response.data;
}

export async function deleteTaskCategory(taskCategoryId: string, abort?: AbortController) {
    const response = await axiosInstance.delete<undefined>(`task-categories/${taskCategoryId}`, {
        signal: abort?.signal
    });
    return response.data;
}
