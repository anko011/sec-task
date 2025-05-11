import type { BadgeProps } from '@radix-ui/themes';
import { assert } from 'superstruct';

import type { Paginated } from '~/shared/api';
import { axiosInstance } from '~/shared/api';

import type { Task } from '../model/task';
import { GetPaginatedTasksContract } from './contracts';

export async function findAllTasks(packageId: string, params?: {}, signal?: AbortSignal): Promise<Paginated<Task>> {
    const response = await axiosInstance.get<unknown>(`task-packages/${packageId}/tasks`, { params, signal });
    assert(response.data, GetPaginatedTasksContract);
    return {
        ...response.data,
        items: response.data.items.map((item) => ({
            ...item,
            category: { ...item.category, color: item.category.color as BadgeProps['color'] },
            createdAt: new Date(item.createdAt),
            deadline: new Date(item.deadline)
        }))
    };
}

export async function createTask(
    packageId: string,
    data: Record<string, unknown>,
    signal?: AbortSignal
): Promise<Task> {
    const response = await axiosInstance.post<Task>(`task-packages/${packageId}/tasks`, data, { signal });
    return response.data;
}

export async function updateTask(
    packageId: string,
    taskId: string,
    data: Record<string, unknown>,
    signal?: AbortSignal
): Promise<Task> {
    const response = await axiosInstance.patch(`task-packages/${packageId}/tasks/${taskId}`, data, { signal });
    return response.data as Task;
}

export async function deleteTask(packageId: string, taskId: string, signal?: AbortSignal) {
    const response = await axiosInstance.delete(`task-packages/${packageId}/tasks/${taskId}`, { signal });
    return response.data;
}

export async function updateTaskStatus(
    packageId: string,
    taskId: string,
    data?: Record<string, unknown>,
    signal?: AbortSignal
) {
    const response = await axiosInstance.post(`task-packages/${packageId}/tasks/${taskId}/change-status`, data, {
        signal
    });

    return response.data;
}
