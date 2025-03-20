import { assert } from 'superstruct';

import { organizationTypes } from '../mock';
import type { OrganizationType } from '../model';
import { GetAllOrganizationTypesContract } from './contract';

export namespace OrganizationTypesRepository {
    export async function getAll(): Promise<OrganizationType[]> {
        const res = new Promise((res) =>
            setTimeout(() => {
                res(Array.from(Object.values(organizationTypes)));
            }, 1000)
        );
        const data = await res;
        assert(data, GetAllOrganizationTypesContract);
        return data;
    }
}
