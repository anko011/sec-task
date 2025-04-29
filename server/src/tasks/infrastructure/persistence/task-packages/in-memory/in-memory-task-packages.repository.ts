import { Injectable } from '@nestjs/common';
import { TaskPackagesPort } from '../../../../application/ports';
import {
  TaskPackage,
  TaskPackageStatus,
} from '../../../../application/entities/task-package';

type TaskPackageFilterCriteria = {
  name?: string;
  baseDocument?: string;
  status?: TaskPackageStatus;
};

type PaginationOptions = {
  limit?: number;
  offset?: number;
};

@Injectable()
export class InMemoryTaskPackagesRepository extends TaskPackagesPort {
  private tasksPackages: TaskPackage[] = [
    this.createTaskInstance(
      '1',
      'Package 1',
      'url:doc#1',
      TaskPackageStatus.ACTIVE,
    ),
    this.createTaskInstance(
      '2',
      'Package 2',
      'url:doc#2',
      TaskPackageStatus.FIXED,
    ),
  ];

  public async save(
    params: Omit<TaskPackage, 'id'> & { id: string },
  ): Promise<TaskPackage> {
    const findIndex = this.tasksPackages.findIndex(
      (taskPackage) => taskPackage.id === params.id,
    );

    if (findIndex > -1) {
      this.tasksPackages[findIndex] = Object.assign(
        this.tasksPackages[findIndex],
        params,
      );

      return this.tasksPackages[findIndex];
    }

    const taskPackage = this.createTaskInstance(
      params.id,
      params.name,
      params.baseDocument,
      params.status,
    );
    this.tasksPackages.push(taskPackage);
    return taskPackage;
  }

  public async delete(id: string | TaskPackage): Promise<void> {
    const initialLength = this.tasksPackages.length;
    const _id = typeof id === 'string' ? id : id.id;
    this.tasksPackages = this.tasksPackages.filter((task) => task.id !== _id);

    if (this.tasksPackages.length === initialLength) {
      throw new Error(`Task with ID ${id} not found`);
    }
  }

  public async update(params: {
    id: string;
    name?: string;
    baseDocument?: string;
    status?: TaskPackageStatus;
  }): Promise<TaskPackage> {
    const task = await this.findOrFail(params.id);

    this.updateProperties(task, params);

    return task;
  }

  public async findAndCount(
    filter?: TaskPackageFilterCriteria,
    pagination?: PaginationOptions,
  ): Promise<[TaskPackage[], number]> {
    const filteredTasks = this.applyFilters(this.tasksPackages, filter);
    const paginatedTasks = this.applyPagination(filteredTasks, pagination);

    return [paginatedTasks, filteredTasks.length];
  }

  public async find(id: string): Promise<TaskPackage | null> {
    return this.tasksPackages.find((task) => task.id === id) ?? null;
  }

  public async findOrFail(id: string): Promise<TaskPackage> {
    const task = await this.find(id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }
    return task;
  }

  private createTaskInstance(
    id: string,
    name: string,
    baseDocument: string,
    status: TaskPackageStatus,
  ): TaskPackage {
    return new TaskPackage(id, name, baseDocument, status);
  }

  private updateProperties(
    task: TaskPackage,
    updates: Partial<Omit<TaskPackage, 'id'>>,
  ): void {
    Object.assign(task, updates);
  }

  private applyFilters(
    packages: TaskPackage[],
    filter?: TaskPackageFilterCriteria,
  ): TaskPackage[] {
    if (!filter) return [...packages];

    return packages.filter((taskPackage) => {
      return (
        (!filter.name || taskPackage.name.includes(filter.name)) &&
        (!filter.baseDocument ||
          taskPackage.baseDocument.includes(filter.baseDocument)) &&
        (!filter.status || taskPackage.status === filter.status)
      );
    });
  }

  private applyPagination(
    packages: TaskPackage[],
    pagination?: PaginationOptions,
  ): TaskPackage[] {
    const limit = pagination?.limit ?? 10;
    const offset = pagination?.offset ?? 0;

    return packages.slice(offset, offset + limit);
  }
}
