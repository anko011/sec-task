import { AxiosError, CanceledError } from 'axios';
import { type ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router';

import { useCurrentUser, type User } from '~/entities/users';
import { refreshToken } from '~/features/auth';
import { Loader } from '~/shared/ui/loader';
import { axiosInstance } from '~/shared/api';

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { setUser, user } = useCurrentUser();
    const [isCheckingAuthProgress, setIsCheckingAuthProgress] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();
        const checkAuth = async () => {
            try {
                const { accessToken } = await refreshToken();
                localStorage.setItem('accessToken', accessToken);
                const user = (await axiosInstance.get<User>('auth/me')).data;
                setUser(user);
                setIsCheckingAuthProgress(false);
            } catch (error) {
                if (error instanceof CanceledError) return;
                if (error instanceof AxiosError && error.status === 401) {
                    setIsCheckingAuthProgress(false);
                    return;
                }
                throw error;
            } finally {
                if (!abortController.signal.aborted) setIsCheckingAuthProgress(false);
            }
        };

        void checkAuth();

        return () => {
            abortController.abort();
        };
    }, []);

    if (isCheckingAuthProgress) {
        return <Loader style={{ minHeight: '100vh', minWidth: '100vw' }} />;
    }

    if (user != null) return children;
    return <Navigate to="/sign-in" />;
}
