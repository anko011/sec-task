import { TaskPackage, TaskPackageStatus } from '../entities/task-package';

export abstract class TaskPackagesPort {
  abstract findAndCount(
    where?: {
      name?: string;
      baseDocument?: string;
      status?: TaskPackageStatus;
    },
    options?: {
      limit?: number;
      offset?: number;
    },
  ): Promise<[TaskPackage[], number]>;

  abstract find(id: string): Promise<TaskPackage | null>;

  abstract save(taskPackage: TaskPackage): Promise<TaskPackage>;

  abstract delete(id: string | TaskPackage): Promise<void>;

  abstract update(dto: {
    id: string;
    name?: string;
    baseDocument?: string;
    status?: TaskPackageStatus;
  }): Promise<TaskPackage>;
}
