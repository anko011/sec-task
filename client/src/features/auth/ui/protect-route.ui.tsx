import { AxiosError, CanceledError } from 'axios';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';

import { useCurrentUser } from '~/entities/users';
import { getMe } from '~/entities/users/api/repository';
import { refreshToken } from '~/features/auth';
import { Loader } from '~/shared/ui/loader';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { setUser, user } = useCurrentUser();
    const [isCheckingAuthProgress, setIsCheckingAuthProgress] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();

        void refreshToken(abortController)
            .then(({ accessToken }) => {
                localStorage.setItem('accessToken', accessToken);
                return getMe();
            })
            .then((user) => {
                setUser(user);
            })
            .catch((error: unknown) => {
                if (error instanceof CanceledError) return;
                if (error instanceof AxiosError && error.status === 401) {
                    setIsCheckingAuthProgress(false);
                    return;
                }
                throw error;
            })
            .finally(() => {
                if (!abortController.signal.aborted) setIsCheckingAuthProgress(false);
            });

        return () => {
            abortController.abort();
        };
    }, []);

    if (isCheckingAuthProgress) {
        return <Loader style={{ minHeight: '100vh', minWidth: '100vw' }} />;
    }

    if (user !== null) return children;
    return <Navigate to="/sign-in" />;
};
