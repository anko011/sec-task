import type { TaskDangerStatus } from '~/entities/tasks';
import type { TaskName } from '~/entities/task-names';
import type { TaskCategory } from '~/entities/task-categories';

export type TaskDraft = {
    number: string;
    description: string;
    bdu: string[];
    cve: string[];
    dangerStatus: TaskDangerStatus;
    name: TaskName;
    category: TaskCategory;
    additionalInformation?: string | null;
};
