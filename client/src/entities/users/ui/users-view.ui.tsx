import { createContext, type Dispatch, type ReactNode, type SetStateAction, useState } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { useDebouncedCallback } from 'use-debounce';

import type { PaginateOptions } from '~/shared/api';
import { useStrictContext } from '~/shared/lib';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { MaskedFilterField } from '~/shared/ui/masked-filter-field';

import { type UserWithOrganizationFilters, useUsersWithOrganization } from '../model/use-users-with-organization';
import { UsersWithOrganizationTable, type UsersWithOrganizationTableProps } from './users-with-organization-table.ui';
import { type Role, UserRolesSelector } from '~/entities/users';

export const UsersViewContext = createContext<
    | (ReturnType<typeof useUsersWithOrganization> & {
          pagination: PaginateOptions;
          setPagination: Dispatch<SetStateAction<PaginateOptions>>;
          filters: UserWithOrganizationFilters;
          setFilters: Dispatch<SetStateAction<UserWithOrganizationFilters>>;
      })
    | null
>(null);

function Root({ children }: { children?: ReactNode }) {
    const [pagination, setPagination] = useState<PaginateOptions>({ limit: 10, offset: 0 });
    const [filters, setFilters] = useState<UserWithOrganizationFilters>({});
    const usersController = useUsersWithOrganization(filters, pagination);
    return (
        <UsersViewContext.Provider
            value={{
                ...usersController,
                filters,
                setFilters,
                pagination,
                setPagination
            }}
        >
            {children}
        </UsersViewContext.Provider>
    );
}

function DataTable(props: Omit<UsersWithOrganizationTableProps, 'data'>) {
    const { data, isLoading, setPagination } = useStrictContext(UsersViewContext);
    if (isLoading) return <Loader />;
    if (!data) return null;

    return (
        <Flex direction="column" gap="2">
            <UsersWithOrganizationTable data={data.items} {...props} />
            <Pagination data={data} onChange={setPagination} />
        </Flex>
    );
}

function EmailFilter() {
    const { setFilters, filters } = useStrictContext(UsersViewContext);

    const debounced = useDebouncedCallback((value: string) => {
        setFilters((prev) => ({ ...prev, email: value }));
    }, 300);

    const handleClear = () => {
        setFilters((prev) => ({ ...prev, email: '' }));
    };

    return (
        <MaskedFilterField
            label="Email"
            defaultValue={filters.email}
            placeholder="Введите email..."
            onChange={debounced}
            onClear={handleClear}
        />
    );
}

function FirstNameFilter() {
    const { setFilters, filters } = useStrictContext(UsersViewContext);

    const debounced = useDebouncedCallback((value: string) => {
        setFilters((prev) => ({ ...prev, firstName: value }));
    }, 300);

    const handleClear = () => {
        setFilters((prev) => ({ ...prev, firstName: '' }));
    };

    return (
        <MaskedFilterField
            label="Имя"
            defaultValue={filters.firstName}
            placeholder="Введите имя..."
            onChange={debounced}
            onClear={handleClear}
        />
    );
}

function SecondNameFilter() {
    const { setFilters, filters } = useStrictContext(UsersViewContext);

    const debounced = useDebouncedCallback((value: string) => {
        setFilters((prev) => ({ ...prev, secondName: value }));
    }, 300);

    const handleClear = () => {
        setFilters((prev) => ({ ...prev, secondName: '' }));
    };

    return (
        <MaskedFilterField
            label="Фамилия"
            defaultValue={filters.secondName}
            placeholder="Введите фамилию..."
            onChange={debounced}
            onClear={handleClear}
        />
    );
}

function PatronymicNameFilter() {
    const { setFilters, filters } = useStrictContext(UsersViewContext);

    const debounced = useDebouncedCallback((value: string) => {
        setFilters((prev) => ({ ...prev, patronymic: value }));
    }, 300);

    const handleClear = () => {
        setFilters((prev) => ({ ...prev, patronymic: '' }));
    };

    return (
        <MaskedFilterField
            label="Отчество"
            defaultValue={filters.patronymic}
            placeholder="Введите отчество..."
            onChange={debounced}
            onClear={handleClear}
        />
    );
}

function OrganizationNameFilter() {
    const { setFilters, filters } = useStrictContext(UsersViewContext);

    const debounced = useDebouncedCallback((value: string) => {
        setFilters((prev) => ({ ...prev, organizationName: value }));
    }, 300);

    const handleClear = () => {
        setFilters((prev) => ({ ...prev, organizationName: '' }));
    };

    return (
        <MaskedFilterField
            label="Название организации"
            defaultValue={filters.organizationName}
            placeholder="Введите название организации..."
            onChange={debounced}
            onClear={handleClear}
        />
    );
}

function RoleFilter() {
    const { setFilters, filters } = useStrictContext(UsersViewContext);

    const onChange = (role?: Role) => {
        setFilters((prev) => ({ ...prev, role: role }));
    };

    return (
        <Flex asChild align="center" gap="2">
            <label>
                <Text size="2" wrap="nowrap">
                    Роль
                </Text>
                <UserRolesSelector defaultValue={filters.role} onChange={onChange} />
            </label>
        </Flex>
    );
}

export const UsersView = {
    Root,
    DataTable,
    EmailFilter,
    FirstNameFilter,
    SecondNameFilter,
    PatronymicNameFilter,
    OrganizationNameFilter,
    RoleFilter
};
