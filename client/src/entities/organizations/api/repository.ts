import { assert } from 'superstruct';

import type { PaginateOptions } from '~/shared/api';

import { organizations, statusChanges } from '../mock';
import { GetAllOrganizationsContract, GetAllStatusChangeContract } from './contract';

type OrganizationFilterCriteria = {
    id?: string;
    name?: string;
    isArchived?: boolean;
    typeId?: string;
};

export namespace OrganizationsRepository {
    export async function findAll(where?: OrganizationFilterCriteria, options?: PaginateOptions) {
        const res = new Promise((res) =>
            setTimeout(() => {
                let data = Array.from(Object.values(organizations));
                if (where != null) {
                    data = data.filter((item) => {
                        const idMatch = where.id === undefined || item.id.includes(where.id);

                        const nameMatch =
                            where.name === undefined || item.name.toLowerCase().includes(where.name.toLowerCase());

                        const isArchivedMatch = where.isArchived === undefined || item.isArchived === where.isArchived;

                        const typeMatch = where.typeId === undefined || item.type.id === where.typeId;

                        return idMatch && nameMatch && isArchivedMatch && typeMatch;
                    });
                }

                res(data);
            }, 1000)
        );
        const data = await res;
        assert(data, GetAllOrganizationsContract);

        const limit = options?.limit ?? data.length;
        const offset = options?.offset ?? 0;
        const paginatedItems = data.slice(offset, offset + limit);

        return {
            items: paginatedItems,
            limit,
            offset,
            total: data.length
        };
    }
}

export namespace ChangeStatusesRepository {
    export async function findAll(
        where?: {
            organizationId?: string;
            packageId?: string;
            taskId?: string;
        },
        options?: PaginateOptions
    ) {
        const res = new Promise((res) => {
            setTimeout(() => {
                let data = statusChanges;
                if (where != null) {
                    data = data.filter((item) => {
                        const organizationIdMatch =
                            where.organizationId === undefined || item.organization.id === where.organizationId;
                        const taskIdMatch = where.taskId === undefined || item.taskId === where.taskId;
                        const packageIdMatch = where.taskId === undefined || item.packageId === where.packageId;

                        return organizationIdMatch && taskIdMatch && packageIdMatch;
                    });
                }
                res(data);
            }, 1000);
        });
        const data = await res;
        assert(data, GetAllStatusChangeContract);

        const limit = options?.limit ?? data.length;
        const offset = options?.offset ?? 0;
        const paginatedItems = data.slice(offset, offset + limit);

        return {
            items: paginatedItems,
            limit,
            offset,
            total: data.length
        };
    }
}
