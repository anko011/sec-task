import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, use, useState } from 'react';

import type { User } from '../model/user';

const CurrentUserContext = createContext<{
    setUser: Dispatch<SetStateAction<User | null>>;
    user: User | null;
} | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    return <CurrentUserContext.Provider value={{ setUser, user }}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser() {
    const ctx = use(CurrentUserContext);
    if (ctx == null) throw new Error('useCurrentUser must be in CurrentUserContext');
    return ctx;
}
