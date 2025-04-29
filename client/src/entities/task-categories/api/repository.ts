import { assert } from 'superstruct';

import { taskCategories } from '../mock';
import type { TaskCategory } from '../model/task-category';
import { GetAllTaskCategoriesContract, GetTaskCategoryContract } from './contracts';

type TaskCategoryFilterCriteria = {
    id?: string;
    name?: string;
};

export namespace TaskCategoriesRepository {
    export async function getById(id: string): Promise<TaskCategory> {
        const res = new Promise((resolve) =>
            setTimeout(() => {
                resolve(taskCategories[id as keyof typeof taskCategories]);
            }, 1000)
        );
        const data = await res;
        assert(data, GetTaskCategoryContract);
        return data as TaskCategory;
    }

    export async function findAll(where?: TaskCategoryFilterCriteria): Promise<TaskCategory[]> {
        const res = new Promise((resolve) =>
            setTimeout(() => {
                let data = Array.from(Object.values(taskCategories));

                if (where != null) {
                    data = data.filter((item) => {
                        const idMatch = where.id === undefined || item.id.includes(where.id);

                        const nameMatch =
                            where.name === undefined || item.name.toLowerCase().includes(where.name.toLowerCase());

                        return idMatch && nameMatch;
                    });
                }
                resolve(data);
            }, 500)
        );
        const data = await res;
        assert(data, GetAllTaskCategoriesContract);
        return data as TaskCategory[];
    }
}
