import type { Task } from '~/entities/tasks';

export type TaskDraft = Omit<Task, 'id' | 'packageId' | 'assigneeProgresses'>;
export type TaskDraftFilterCriteria = Partial<
    Omit<TaskDraft, 'category' | 'name'> & {
        categoryId: string;
        nameId: string;
    }
>;
