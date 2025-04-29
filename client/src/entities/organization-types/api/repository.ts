import { assert } from 'superstruct';

import { organizationTypes } from '../mock';
import type { OrganizationType } from '../model';
import { GetAllOrganizationTypesContract } from './contract';

export namespace OrganizationTypesRepository {
    export async function findAll(where?: { id?: string; name?: string }): Promise<OrganizationType[]> {
        const res = new Promise((res) =>
            setTimeout(() => {
                let data = Array.from(Object.values(organizationTypes));

                if (where != null) {
                    data = data.filter((item) => {
                        const idMatch = where.id === undefined || item.id.includes(where.id);

                        const nameMatch =
                            where.name === undefined || item.name.toLowerCase().includes(where.name.toLowerCase());

                        return idMatch && nameMatch;
                    });
                }

                res(data);
            }, 1000)
        );
        const data = await res;
        assert(data, GetAllOrganizationTypesContract);
        return data;
    }
}
