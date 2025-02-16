import { assert } from 'superstruct';

import { taskPackages } from '../mock';
import { GetAllTaskPackagesContract, GetTaskPackageContract } from './contract';

export namespace TaskPackagesRepository {
    export async function getAll() {
        const res = new Promise((res) =>
            setTimeout(() => {
                res(Array.from(Object.values(taskPackages)));
            }, 1000)
        );

        const data = await res;
        assert(data, GetAllTaskPackagesContract);
        return data;
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
