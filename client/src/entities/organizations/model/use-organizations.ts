import { axiosInstance, type PaginateOptions } from '~/shared/api';
import useSWR from 'swr';

import { GetPaginatedOrganizationsContract } from '../api/contracts';

export type OrganizationFilters = {
    name?: string;
    typeId?: string;
    isArchived?: boolean;
};

export function useOrganizations(filters: OrganizationFilters, pagination: PaginateOptions) {
    const { data, mutate, isLoading } = useSWR(
        ['/organizations', filters, pagination],
        async ([url, filters, pagination]) => {
            const response = await axiosInstance.get(url, {
                params: { ...pagination, ...filters }
            });
            return GetPaginatedOrganizationsContract.parse(response.data);
        }
    );

    return {
        isLoading,
        data,
        mutate
    };
}
