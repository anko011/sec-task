import type { InternalAxiosRequestConfig } from 'axios';
import axios, { AxiosError } from 'axios';

import { refreshToken } from '~/features/auth';

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _isRetry?: boolean;
}

const baseURL = (import.meta.env.VITE_BASE_API as string | undefined) ?? '/api';

export const axiosInstance = axios.create({
    baseURL,
    withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken') ?? ''}`;
    return config;
});

let abortController: AbortController | null = null;

axiosInstance.interceptors.response.use(
    (config) => config,
    async (error) => {
        if (!(error instanceof AxiosError)) throw error;

        const config = error.config as CustomAxiosRequestConfig | undefined;

        if (
            error.response?.status === 401 &&
            config != null &&
            !(config._isRetry ?? false) &&
            !(config.url?.includes('/refresh') ?? false)
        ) {
            if (abortController !== null) abortController.abort();
            abortController = new AbortController();

            try {
                config._isRetry = true;
                const { accessToken } = await refreshToken(abortController);
                localStorage.setItem('accessToken', accessToken);
                return await axiosInstance.request(config);
            } catch {
                /* empty */
            }
        }
        throw error;
    }
);
