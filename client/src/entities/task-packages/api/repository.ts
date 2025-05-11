import { assert } from 'superstruct';

import type { TaskPackage, TaskPackageStatus } from '~/entities/task-packages';
import type { Paginated } from '~/shared/api';
import { axiosInstance } from '~/shared/api';

import { GetPaginatedTaskPackagesContract } from './contract';

type TaskPackagesFilterCriteria = {
    id?: string;
    incomingRequisite?: string;
    outgoingRequisite?: string;
    status?: TaskPackageStatus;
};

export async function findAllTaskPackages(
    params?: URLSearchParams,
    signal?: AbortSignal
): Promise<Paginated<TaskPackage>> {
    const response = await axiosInstance.get<Paginated<TaskPackage>>('task-packages', { params, signal });
    assert(response.data, GetPaginatedTaskPackagesContract);
    return {
        ...response.data,
        items: response.data.items.map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            reportDeadline: { ...item.reportDeadline, deadline: new Date(item.reportDeadline.deadline) },
            submissionData: new Date(item.submissionData)
        }))
    };
}

export async function getTaskPackageById(id: string, signal?: AbortSignal): Promise<TaskPackage> {
    const response = await axiosInstance.get<TaskPackage>('task-packages/' + id, { signal });
    return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        reportDeadline: { ...response.data.reportDeadline, deadline: new Date(response.data.reportDeadline.deadline) },
        submissionData: new Date(response.data.submissionData)
    } as TaskPackage;
}

export async function createTaskPackage(data?: Record<string, unknown>, signal?: AbortSignal) {
    const response = await axiosInstance.post<TaskPackage>('task-packages', data, { signal });
    return response.data;
}

export async function updateTaskPackage(id: string, data?: Record<string, unknown>, signal?: AbortSignal) {
    const response = await axiosInstance.patch<TaskPackage>(`task-packages/${id}`, data, { signal });
    return response.data;
}

export async function deleteTaskPackage(id: string, signal?: AbortSignal) {
    const response = await axiosInstance.delete<TaskPackage>(`task-packages/${id}`, { signal });
    return response.data;
}
