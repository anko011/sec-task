import { assert } from 'superstruct';

import { taskCategories } from '../mock';
import type { TaskCategory } from '../model/task-category';
import { GetAllTaskCategoriesContract, GetTaskCategoryContract } from './contracts';

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

    export async function getAll(): Promise<TaskCategory[]> {
        const res = new Promise((resolve) =>
            setTimeout(() => {
                resolve(Array.from(Object.values(taskCategories)));
            }, 500)
        );
        const data = await res;
        assert(data, GetAllTaskCategoriesContract);
        return data as TaskCategory[];
    }
}
