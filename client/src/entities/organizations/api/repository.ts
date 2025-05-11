import { assert } from 'superstruct';

import type { PaginateOptions } from '~/shared/api';
import { axiosInstance } from '~/shared/api';

import type { Organization } from '../model';
import { GetPaginatedOrganizationsContract } from './contract';

export type OrganizationFilterCriteria = {
    name?: string;
    archived?: 'on' | 'off';
    typeId?: string;
};

export async function findAllOrganizations(
    params?: (OrganizationFilterCriteria & PaginateOptions) | URLSearchParams,
    signal?: AbortSignal
) {
    const response = await axiosInstance.get<unknown>('organizations', { params, signal });
    assert(response.data, GetPaginatedOrganizationsContract);
    return response.data;
}

export async function getOrganizationById(id: string): Promise<Organization> {
    const response = await axiosInstance.get<Organization>(`organizations/${id}`);
    return response.data;
}

export async function createOrganization(data: Record<string, FormDataEntryValue>, abort?: AbortController) {
    const response = await axiosInstance.post<Organization>('organizations', data, { signal: abort?.signal });
    return response.data;
}

export async function updateOrganization(
    organizationId: string,
    data: Record<string, FormDataEntryValue>,
    abort?: AbortController
) {
    const response = await axiosInstance.patch<Organization>(`organizations/${organizationId}`, data, {
        signal: abort?.signal
    });
    return response.data;
}

export async function deleteOrganization(organizationId: string, abort?: AbortController) {
    const response = await axiosInstance.delete<undefined>(`organizations/${organizationId}`, {
        signal: abort?.signal
    });
    return response.data;
}
