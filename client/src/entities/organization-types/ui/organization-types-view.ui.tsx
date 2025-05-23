import { createContext, type Dispatch, type ReactNode, type SetStateAction, useRef, useState } from 'react';
import { Flex } from '@radix-ui/themes';
import { useDebouncedCallback } from 'use-debounce';

import type { PaginateOptions } from '~/shared/api';
import { useStrictContext } from '~/shared/lib';
import { Loader } from '~/shared/ui/loader';
import { Pagination } from '~/shared/ui/pagination';
import { MaskedFilterField } from '~/shared/ui/masked-filter-field';

import { type OrganizationTypeFilters, useOrganizationTypes } from '../model/use-organization-type';

import { OrganizationTypesTable, type OrganizationTypesTableProps } from './organization-types-table.ui';

export const OrganizationTypesViewContext = createContext<
    | (ReturnType<typeof useOrganizationTypes> & {
          pagination: PaginateOptions;
          setPagination: Dispatch<SetStateAction<PaginateOptions>>;
          filters: OrganizationTypeFilters;
          setFilters: Dispatch<SetStateAction<OrganizationTypeFilters>>;
      })
    | null
>(null);

function Root({ children }: { children?: ReactNode }) {
    const [pagination, setPagination] = useState<PaginateOptions>({ limit: 10, offset: 0 });
    const [filters, setFilters] = useState<OrganizationTypeFilters>({});
    const organizationTypesController = useOrganizationTypes(filters, pagination);
    return (
        <OrganizationTypesViewContext.Provider
            value={{
                ...organizationTypesController,
                filters,
                setFilters,
                pagination,
                setPagination
            }}
        >
            {children}
        </OrganizationTypesViewContext.Provider>
    );
}

function DataTable(props: Omit<OrganizationTypesTableProps, 'data'>) {
    const { data, isLoading, setPagination } = useStrictContext(OrganizationTypesViewContext);
    if (isLoading) return <Loader />;
    if (!data) return null;

    return (
        <Flex direction="column" gap="2">
            <OrganizationTypesTable data={data.items} {...props} />
            <Pagination data={data} onChange={setPagination} />
        </Flex>
    );
}

function TitleFilter() {
    const { setFilters, filters } = useStrictContext(OrganizationTypesViewContext);

    const ref = useRef<HTMLInputElement>(null);

    const debounced = useDebouncedCallback((value: string) => {
        setFilters({ title: value });
    }, 300);

    const handleClear = () => {
        if (ref.current) ref.current.value = '';
        setFilters((prev) => ({ ...prev, title: '' }));
    };

    return (
        <MaskedFilterField
            ref={ref}
            label="Наименование"
            defaultValue={filters.title}
            placeholder="Введите наименование..."
            onChange={debounced}
            onClear={handleClear}
        />
    );
}

export const OrganizationTypesView = { Root, DataTable, TitleFilter };
