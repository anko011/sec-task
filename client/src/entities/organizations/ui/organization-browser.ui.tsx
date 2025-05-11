import { Flex, Text, TextField } from '@radix-ui/themes';
import type { Dispatch, SetStateAction } from 'react';
import { type ChangeEventHandler, createContext, type ReactNode, use, useState } from 'react';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';

import type { OrganizationType } from '~/entities/organization-types';
import { OrganizationTypesSelector } from '~/entities/organization-types';
import { OrganizationArchiveStatusSelector } from '~/entities/organizations';
import type { PaginateOptions } from '~/shared/api';
import { Pagination } from '~/shared/ui/pagination';

import type { OrganizationFilterCriteria } from '../api';
import { findAllOrganizations } from '../api';
import type { OrganizationTableProps } from './organization-table.ui';
import { OrganizationsTable } from './organization-table.ui';

type OrganizationBrowserState = {
    filterCriteria: OrganizationFilterCriteria;
    setFilterCriteria: Dispatch<SetStateAction<OrganizationFilterCriteria>>;
};

export const OrganizationBrowserContext = createContext<OrganizationBrowserState | null>(null);

function Root({ children }: { children?: ReactNode }) {
    const [filterCriteria, setFilterCriteria] = useState<OrganizationFilterCriteria>({});

    return (
        <OrganizationBrowserContext.Provider value={{ filterCriteria, setFilterCriteria }}>
            {children}
        </OrganizationBrowserContext.Provider>
    );
}

function NameFilter() {
    const ctx = use(OrganizationBrowserContext);
    if (ctx === null) throw new Error('NameFilter should be mounted inside Root component');
    const { filterCriteria, setFilterCriteria } = ctx;

    const onChange = useDebouncedCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
        setFilterCriteria((prev) => ({ ...prev, name: e.target.value }));
    }, 350);

    return (
        <TextField.Root
            defaultValue={filterCriteria.name ?? ''}
            onChange={onChange}
            placeholder="Введите название..."
        />
    );
}

function TypeFilter() {
    const ctx = use(OrganizationBrowserContext);
    if (ctx === null) throw new Error('TypeFilter should be mounted inside Root component');
    const { filterCriteria, setFilterCriteria } = ctx;

    const onChange = (type?: OrganizationType) => {
        setFilterCriteria((prev) => ({ ...prev, typeId: type?.id }));
    };

    return (
        <Flex align="center" asChild gap="2">
            <label>
                <Text>Тип организации</Text>
                <OrganizationTypesSelector defaultValue={filterCriteria.typeId} onChange={onChange} />
            </label>
        </Flex>
    );
}

function ArchiveFilter() {
    const ctx = use(OrganizationBrowserContext);
    if (ctx === null) throw new Error('ArchiveFilter should be mounted inside Root component');
    const { setFilterCriteria } = ctx;

    const onChange = (archive?: boolean) => {
        const archived = archive === true ? 'on' : 'off';
        setFilterCriteria((prev) => ({ ...prev, archived }));
    };

    return (
        <Flex align="center" asChild gap="2">
            <label>
                <Text>Статус архивации</Text>
                <OrganizationArchiveStatusSelector onChange={onChange} />
            </label>
        </Flex>
    );
}

function DataTable(props: Omit<OrganizationTableProps, 'data'>) {
    const ctx = use(OrganizationBrowserContext);
    if (ctx === null) throw new Error('DataTable should be mounted inside Root component');
    const { filterCriteria } = ctx;

    const [pagination, setPagination] = useState<PaginateOptions>({ limit: 10, offset: 0 });

    const filters = { ...filterCriteria, ...pagination };

    const { data } = useSWR(['organizations', filters], () => findAllOrganizations(filters), {
        suspense: true
    });

    return (
        <>
            <OrganizationsTable data={data.items} {...props} />
            <Pagination data={data} onChange={setPagination} />
        </>
    );
}

export const OrganizationBrowser = { ArchiveFilter, DataTable, NameFilter, Root, TypeFilter };
