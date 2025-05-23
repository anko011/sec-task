import { createContext, type Dispatch, type ReactNode, type SetStateAction, useRef, useState } from 'react';
import { Flex, Select, Text } from '@radix-ui/themes';
import { useDebouncedCallback } from 'use-debounce';

import { type OrganizationType, OrganizationTypesSelector } from '~/entities/organization-types';

import { axiosInstance, type PaginateOptions } from '~/shared/api';
import { useStrictContext } from '~/shared/lib';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { MaskedFilterField } from '~/shared/ui/masked-filter-field';

import { type OrganizationFilters, useOrganizations } from '../model/use-organizations';

import { OrganizationsTable, type OrganizationTableProps } from './organization-table.ui';
import useSWR from 'swr';
import { GetPaginatedOrganizationsContract } from '~/entities/organizations';

export const OrganizationsViewContext = createContext<
    | (ReturnType<typeof useOrganizations> & {
          pagination: PaginateOptions;
          setPagination: Dispatch<SetStateAction<PaginateOptions>>;
          filters: OrganizationFilters;
          setFilters: Dispatch<SetStateAction<OrganizationFilters>>;
      })
    | null
>(null);

function Root({ children }: { children?: ReactNode }) {
    const [pagination, setPagination] = useState<PaginateOptions>({ limit: 10, offset: 0 });
    const [filters, setFilters] = useState<OrganizationFilters>({});
    const organizationsController = useOrganizations(filters, pagination);
    return (
        <OrganizationsViewContext.Provider
            value={{
                ...organizationsController,
                filters,
                setFilters,
                pagination,
                setPagination
            }}
        >
            {children}
        </OrganizationsViewContext.Provider>
    );
}

function TaskPackageRoot({ taskPackageId, children }: { taskPackageId: string; children?: ReactNode }) {
    const [pagination, setPagination] = useState<PaginateOptions>({ limit: 10, offset: 0 });
    const [filters, setFilters] = useState<OrganizationFilters>({});

    const organizationsController = useSWR(
        [`/task-packages/${taskPackageId}/organizations`, filters, pagination],
        async ([url, filters, pagination]) => {
            const response = await axiosInstance.get(url, {
                params: { ...pagination, ...filters }
            });
            return GetPaginatedOrganizationsContract.parse(response.data);
        }
    );

    return (
        <OrganizationsViewContext.Provider
            value={{
                ...organizationsController,
                filters,
                setFilters,
                pagination,
                setPagination
            }}
        >
            {children}
        </OrganizationsViewContext.Provider>
    );
}

function DataTable(props: Omit<OrganizationTableProps, 'data'>) {
    const { data, isLoading, setPagination } = useStrictContext(OrganizationsViewContext);
    if (isLoading) return <Loader />;
    if (!data) return null;

    return (
        <Flex direction="column" gap="2" width="100%">
            <OrganizationsTable data={data.items} {...props} />
            <Pagination data={data} onChange={setPagination} />
        </Flex>
    );
}

function NameFilter() {
    const { setFilters, filters } = useStrictContext(OrganizationsViewContext);
    const ref = useRef<HTMLInputElement>(null);

    const debounced = useDebouncedCallback((value: string) => {
        setFilters((prev) => ({ ...prev, name: value }));
    }, 300);

    const handleClear = () => {
        setFilters((prev) => ({ ...prev, name: '' }));
        if (ref.current) ref.current.value = '';
    };

    return (
        <MaskedFilterField
            ref={ref}
            defaultValue={filters.name}
            label="Наименование"
            placeholder="Введите наименование..."
            onChange={debounced}
            onClear={handleClear}
        />
    );
}

function TypeFilter() {
    const { setFilters, filters } = useStrictContext(OrganizationsViewContext);

    const onChange = (type?: OrganizationType) => {
        setFilters((prev) => ({ ...prev, typeId: type?.id }));
    };
    return (
        <Flex asChild align="center" gap="2">
            <label>
                <Text size="2" wrap="nowrap">
                    Тип организации
                </Text>
                <OrganizationTypesSelector defaultValue={filters.typeId} onChange={onChange} />
            </label>
        </Flex>
    );
}

function ArchivedFilter() {
    const { setFilters } = useStrictContext(OrganizationsViewContext);

    const onChange = (value: string) => {
        setFilters((prev) => ({ ...prev, isArchived: value === '-1' ? false : value === 'true' }));
    };
    return (
        <Flex asChild align="center" gap="2">
            <label>
                <Text size="2" wrap="nowrap">
                    Статус
                </Text>
                <Select.Root onValueChange={onChange} defaultValue="-1">
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Item value="-1">Не выбрано</Select.Item>
                        <Select.Item value="true">Архивирован</Select.Item>
                        <Select.Item value="false">Активен</Select.Item>
                    </Select.Content>
                </Select.Root>
            </label>
        </Flex>
    );
}

export const OrganizationsView = {
    Root,
    TaskPackageRoot,
    DataTable,
    NameFilter,
    TypeFilter,
    ArchivedFilter
};
