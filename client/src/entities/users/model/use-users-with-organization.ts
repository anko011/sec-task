import type { z } from 'zod';
import useSWR from 'swr';

import { axiosInstance, type PaginateOptions } from '~/shared/api';

import {
    type CreateUserContract,
    type EditUserContract,
    GetPaginatedUsersWithOrganizationContract,
    GetUserWithOrganizationContract
} from '../api/contracts';
import type { Role } from './user';

type CreateUserDto = z.infer<typeof CreateUserContract>;
type EditUserDto = z.infer<typeof EditUserContract>;

export type UserWithOrganizationFilters = {
    email?: string;
    firstName?: string;
    secondName?: string;
    patronymic?: string;
    organizationName?: string;
    role?: Role;
};

export function useUsersWithOrganization(filters: UserWithOrganizationFilters, pagination: PaginateOptions) {
    const { data, mutate, isLoading } = useSWR(['/users-with-organization', filters, pagination], async ([url]) => {
        const response = await axiosInstance.get(url, {
            params: { ...pagination, ...filters }
        });
        try {
            return GetPaginatedUsersWithOrganizationContract.parse(response.data);
        } catch (error) {
            console.error(error);
            throw error;
        }
    });

    const remove = async (id: string) => {
        await axiosInstance.delete(`/users/${id}`);
        await mutate();
    };

    const create = async (data: CreateUserDto) => {
        const response = await axiosInstance.post(`/users`, data);
        await mutate();
        return GetUserWithOrganizationContract.parse(response.data);
    };

    const edit = async (id: string, data: EditUserDto) => {
        const response = await axiosInstance.patch(`/users/${id}`, data);
        await mutate();
        return GetUserWithOrganizationContract.parse(response.data);
    };

    return {
        isLoading,
        data,
        remove,
        create,
        edit
    };
}
