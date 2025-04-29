import { assert } from 'superstruct';

import type { TaskPackage, TaskPackageStatus } from '~/entities/task-packages';
import type { Paginated, PaginateOptions } from '~/shared/api';

import { taskPackages } from '../mock';
import { GetAllTaskPackagesContract, GetTaskPackageContract } from './contract';

type TaskPackagesFilterCriteria = {
    id?: string;
    incomingRequisite?: string;
    outgoingRequisite?: string;
    status?: TaskPackageStatus;
};

export namespace TaskPackagesRepository {
    export async function findAll(
        where?: TaskPackagesFilterCriteria,
        options?: PaginateOptions
    ): Promise<Paginated<TaskPackage>> {
        const res = new Promise<TaskPackage[]>((resolve) =>
            setTimeout(() => {
                let data = Array.from(Object.values(taskPackages));

                if (where != null) {
                    data = data.filter((item) => {
                        const idMatch = where.id === undefined || item.id.includes(where.id);

                        const incomingMatch =
                            where.incomingRequisite === undefined ||
                            item.incomingRequisite.toLowerCase().includes(where.incomingRequisite.toLowerCase());

                        const outgoingMatch =
                            where.outgoingRequisite === undefined ||
                            item.outgoingRequisite.toLowerCase().includes(where.outgoingRequisite.toLowerCase());

                        const statusMatch = where.status === undefined || item.status === where.status;

                        return idMatch && incomingMatch && outgoingMatch && statusMatch;
                    });
                }

                resolve(data);
            }, 1000)
        );

        const data = await res;
        assert(data, GetAllTaskPackagesContract);

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

    export async function getById(id: string) {
        const res = new Promise((res) =>
            setTimeout(() => {
                res(taskPackages[id as keyof typeof taskPackages]);
            }, 1000)
        );

        const data = await res;
        assert(data, GetTaskPackageContract);
        return data;
    }
}
