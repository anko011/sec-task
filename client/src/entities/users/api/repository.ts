import { assert } from 'superstruct';

import type { User, UserWithOrganization } from '~/entities/users';
import type { Paginated } from '~/shared/api';
import { axiosInstance } from '~/shared/api';

import { GetPaginatedUsersContract, GetPaginatedUsersWithOrganizationContract } from './contracts';

export async function findAllUsers(params?: URLSearchParams): Promise<Paginated<User>> {
    const response = await axiosInstance.get<unknown>('users', { params });
    assert(response.data, GetPaginatedUsersContract);
    return response.data;
}

export async function findAllUsersWithOrganization(params?: URLSearchParams): Promise<Paginated<UserWithOrganization>> {
    const response = await axiosInstance.get<unknown>('users-with-organization', { params });
    assert(response.data, GetPaginatedUsersWithOrganizationContract);
    return response.data;
}

export async function createUser(dto: Record<string, string | undefined>) {
    const response = await axiosInstance.post<User>('users', dto);
    return response.data;
}

export async function updateUser(userId: string, dto: Record<string, string | undefined>) {
    const response = await axiosInstance.patch<User>(`users/${userId}`, dto);
    return response.data;
}

export async function deleteUser(userId: string) {
    return await axiosInstance.delete(`users/${userId}`);
}

export async function getMe() {
    const response = await axiosInstance.get<User>('auth/me');
    return response.data;
}
