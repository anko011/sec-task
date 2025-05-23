import { createContext, type ReactNode } from 'react';
import type { TaskPackage } from '~/entities/task-packages';

export const TaskPackageContext = createContext<TaskPackage | null>(null);

export function TaskPackageProvider({ taskPackage, children }: { taskPackage: TaskPackage; children: ReactNode }) {
    return <TaskPackageContext value={taskPackage}>{children}</TaskPackageContext>;
}
