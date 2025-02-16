import { assert } from 'superstruct';

import type { TaskPackage } from '~/entities/task-packages/@x/tasks';

import { tasks } from '../mock';
import type { Task } from '../model/task';
import { GetTaskContract, GetTasksContract } from './contracts';

export namespace TasksRepository {
    export async function getPackageTasks(packageId: string | TaskPackage): Promise<Task[]> {
        const id = typeof packageId === 'string' ? packageId : packageId.id;
        const res = new Promise((resolve) =>
            setTimeout(() => {
                resolve(Array.from(Object.values(tasks)).filter((t) => t.packageId === id));
            }, 1000)
        );
        const data = await res;
        assert(data, GetTasksContract);
        return data as Task[];
    }

    export async function getTask(_: string | TaskPackage, taskId: string | TaskPackage): Promise<Task> {
        const tskId = typeof taskId === 'string' ? taskId : taskId.id;

        const res = new Promise((resolve) =>
            setTimeout(() => {
                resolve(tasks[tskId]);
            }, 1000)
        );

        const data = await res;
        assert(data, GetTaskContract);
        return data as Task;
    }
}
