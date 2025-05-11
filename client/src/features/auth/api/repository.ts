import { assert } from 'superstruct';

import { axiosInstance } from '~/shared/api';

import { GetAuthTokenContract } from './contracts';

interface LoginResponse {
    accessToken: string;
}

export const login = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const response = await axiosInstance.post<unknown>('/auth/sign-in', credentials);
    const { data } = response;
    assert(data, GetAuthTokenContract);
    return data;
};

export const logout = async (): Promise<void> => {
    const res = await axiosInstance.post('/auth/logout');
};

export const refreshToken = async (abort?: AbortController): Promise<{ accessToken: string }> => {
    const response = await axiosInstance.post<unknown>('/auth/refresh', null, { signal: abort?.signal });
    const { data } = response;
    assert(data, GetAuthTokenContract);
    return data;
};
