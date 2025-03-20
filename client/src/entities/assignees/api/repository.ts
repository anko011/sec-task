import { assert } from 'superstruct';

import { assignees } from '../mock';
import { GetAllAssignees } from './contracts';

export namespace AssigneesRepository {
    export async function getAll() {
        const res = new Promise((res) =>
            setTimeout(() => {
                res(Object.values(assignees));
            }, 500)
        );

        const data = await res;
        assert(data, GetAllAssignees);

        return data;
    }
}
