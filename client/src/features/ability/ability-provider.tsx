import type { ExtractSubjectType, MongoAbility } from '@casl/ability';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { createContextualCan } from '@casl/react';
import type { Consumer, ReactNode } from 'react';
import { createContext, use, useEffect, useState } from 'react';

import type { User } from '~/entities/users';
import { Role, useCurrentUser } from '~/entities/users';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'fix';
export type Subjects = 'User' | 'TaskPackage' | 'Organization' | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export const createAbility = (user: User | null): AppAbility => {
    const { build, can, cannot } = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (user == null) return build();

    if (user.role === Role.Admin) {
        can('manage', 'all');
    }

    if (user.role === Role.Assigner) {
        can('read', 'TaskPackage');
    }

    if (user.role === Role.Operator || user.role === Role.Supervisor) {
        can('manage', 'TaskPackage');
        cannot('fix', 'TaskPackage');
        can('read', 'Organization');
    }

    if (user.role === Role.Supervisor) {
        can('fix', 'TaskPackage');
    }

    return build({
        detectSubjectType: (object: string): ExtractSubjectType<AppAbility> => object as ExtractSubjectType<AppAbility>
    });
};

export const AbilityContext = createContext<AppAbility | null>(null);

export const Can = createContextualCan(AbilityContext.Consumer as Consumer<AppAbility>);

export const useAbility = () => {
    const ctx = use(AbilityContext);
    if (ctx == null) throw new Error('use Ability uses not inside AbilityContext');
    return ctx;
};

export const AbilityProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useCurrentUser();
    const [ability, setAbility] = useState<AppAbility>(createAbility(user));

    useEffect(() => {
        setAbility(createAbility(user));
    }, [user]);

    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
};
