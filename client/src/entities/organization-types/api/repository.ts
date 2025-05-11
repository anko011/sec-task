import { assert } from 'superstruct';

import { axiosInstance } from '~/shared/api';

import type { OrganizationType } from '../model';
import { GetPaginatedOrganizationTypesContract } from './contract';

export async function findAllOrganizationTypes(params?: URLSearchParams, abort?: AbortController) {
    const { data } = await axiosInstance.get<unknown>('organization-types', { params, signal: abort?.signal });
    assert(data, GetPaginatedOrganizationTypesContract);
    return data;
}

export async function createOrganizationType(data: Record<string, FormDataEntryValue>, abort?: AbortController) {
    const response = await axiosInstance.post<OrganizationType>('organization-types', data, { signal: abort?.signal });
    return response.data;
}

export async function updateOrganizationType(
    organizationTypeId: string,
    data: Record<string, FormDataEntryValue>,
    abort?: AbortController
) {
    const response = await axiosInstance.patch<OrganizationType>(`organization-types/${organizationTypeId}`, data, {
        signal: abort?.signal
    });
    return response.data;
}

export async function deleteOrganizationType(organizationTypeId: string, abort?: AbortController) {
    const response = await axiosInstance.delete<undefined>(`organization-types/${organizationTypeId}`, {
        signal: abort?.signal
    });
    return response.data;
}
