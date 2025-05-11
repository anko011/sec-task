import { assert } from 'superstruct';

import { axiosInstance } from '~/shared/api';

import type { TaskName } from '../model';
import { GetPaginatedTaskNamesContract } from './contracts';

export async function findAllTaskNames(params?: URLSearchParams, abort?: AbortController) {
    const { data } = await axiosInstance.get<unknown>('task-names', { params, signal: abort?.signal });
    assert(data, GetPaginatedTaskNamesContract);
    return data;
}

export async function createTaskName(data: Record<string, FormDataEntryValue>, abort?: AbortController) {
    const response = await axiosInstance.post<TaskName>('task-names', data, { signal: abort?.signal });
    return response.data;
}

export async function updateTaskName(
    taskNameId: string,
    data: Record<string, FormDataEntryValue>,
    abort?: AbortController
) {
    const response = await axiosInstance.patch<TaskName>(`task-names/${taskNameId}`, data, {
        signal: abort?.signal
    });
    return response.data;
}

export async function deleteTaskName(taskNameId: string, abort?: AbortController) {
    const response = await axiosInstance.delete<undefined>(`task-names/${taskNameId}`, {
        signal: abort?.signal
    });
    return response.data;
}
