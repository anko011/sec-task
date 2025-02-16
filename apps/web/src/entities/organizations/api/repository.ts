import { assert } from 'superstruct';

import { organizations } from '../mock';
import { GetAllOrganizationsContract } from './contract';

export namespace OrganizationsRepository {
    export async function getAll() {
        const res = new Promise((res) =>
            setTimeout(() => {
                res(Array.from(Object.values(organizations)));
            }, 1000)
        );
        const data = await res;
        assert(data, GetAllOrganizationsContract);
        return data;
    }
}
