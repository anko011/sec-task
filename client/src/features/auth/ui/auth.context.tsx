import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import type { User } from '~/entities/users';

interface AuthContextType {
    isAuthenticated: boolean;
    isCheckingAuthProgress: boolean;
    user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: false,
                isCheckingAuthProgress: false,
                user: null
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context == null) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
