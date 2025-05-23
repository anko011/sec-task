import type { z } from 'zod';
import useSWR from 'swr';

import { axiosInstance, type PaginateOptions } from '~/shared/api';

import {
    type CreateOrganizationTypeContract,
    type EditOrganizationTypeContract,
    GetOrganizationTypeContract,
    GetPaginatedOrganizationTypesContract
} from '../api/contracts';

type CreateOrganizationTypeDto = z.infer<typeof CreateOrganizationTypeContract>;
type EditOrganizationTypeDto = z.infer<typeof EditOrganizationTypeContract>;

export type OrganizationTypeFilters = {
    title?: string;
};

export function useOrganizationTypes(filters: OrganizationTypeFilters, pagination: PaginateOptions) {
    const { data, mutate, isLoading } = useSWR(
        ['/organization-types', filters, pagination],
        async ([url, filters, pagination]) => {
            const response = await axiosInstance.get(url, {
                params: { ...pagination, ...filters }
            });
            return GetPaginatedOrganizationTypesContract.parse(response.data);
        }
    );

    const remove = async (id: string) => {
        await axiosInstance.delete(`/organization-types/${id}`);
        await mutate();
    };

    const create = async (data: CreateOrganizationTypeDto) => {
        const response = await axiosInstance.post(`/organization-types`, data);
        await mutate();
        return GetOrganizationTypeContract.parse(response.data);
    };

    const edit = async (id: string, data: EditOrganizationTypeDto) => {
        const response = await axiosInstance.patch(`/organization-types/${id}`, data);
        await mutate();
        return GetOrganizationTypeContract.parse(response.data);
    };

    return {
        isLoading,
        data,
        remove,
        create,
        edit
    };
}
