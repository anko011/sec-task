import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Task } from './task';
import { TaskCategory } from './task-category';
import { TaskDangerStatus } from './task-danger-status';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';

export enum TaskPackageStatus {
  ACTIVE = 'ACTIVE',
  FIXED = 'FIXED',
}

export class TaskPackage {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly baseDocument: string;

  public constructor(
    id: string,
    private _name: string,
    baseDocument: string,
    private _status: TaskPackageStatus = TaskPackageStatus.ACTIVE,
    private tasks: Task[] = [],
  ) {
    this.id = id;
    this.baseDocument = baseDocument;
  }

  @ApiProperty()
  @Expose()
  public get name(): string {
    return this._name;
  }

  public set name(name: string) {
    //TODO: Consider adding a validation here
    this._name = name;
  }

  @ApiProperty()
  @Expose()
  public get status(): TaskPackageStatus {
    return this._status;
  }

  public fixate(): void {
    this._status = TaskPackageStatus.FIXED;
  }

  public getTaskCount(): number {
    return this.tasks.length;
  }

  public findTask(taskId: string): Task | null {
    const task = this.tasks.find((task) => task.id === taskId);
    return task ?? null;
  }

  public addTask(dto: {
    readonly name: string;
    readonly description: string;
    readonly category: TaskCategory;
    readonly dangerStatus: TaskDangerStatus;
  }) {
    const id = uuidv4();
    const task = new Task(
      id,
      dto.name,
      dto.description,
      dto.category,
      dto.dangerStatus,
      this.id,
    );
    this.tasks.push(task);
    return task;
  }

  public getTasks(
    filters?: {
      description?: string;
      name?: string;
      category?: TaskCategory;
      dangerStatus?: TaskDangerStatus;
      packageId?: string;
    },
    limit?: number,
    offset?: number,
  ): Task[] {
    if (!filters && limit === undefined && offset === undefined) {
      return [...this.tasks];
    }

    const filteredTasks = this.applyFilters(this.tasks, filters);
    return this.applyPagination(filteredTasks, limit, offset);
  }

  private applyFilters(
    tasks: Task[],
    filters?: {
      description?: string;
      name?: string;
      category?: TaskCategory;
      dangerStatus?: TaskDangerStatus;
      packageId?: string;
    },
  ): Task[] {
    if (!filters) return [...tasks];

    return tasks.filter((task) => {
      const matchesDescription = filters.description
        ? task.description.includes(filters.description)
        : true;

      const matchesName = filters.name
        ? task.name.includes(filters.name)
        : true;

      const matchesCategory =
        filters.category !== undefined
          ? task.category === filters.category
          : true;

      const matchesDangerStatus =
        filters.dangerStatus !== undefined
          ? task.dangerStatus === filters.dangerStatus
          : true;

      const matchesPackageId =
        filters.packageId !== undefined
          ? task.packageId === filters.packageId
          : true;

      return (
        matchesDescription &&
        matchesName &&
        matchesCategory &&
        matchesDangerStatus &&
        matchesPackageId
      );
    });
  }

  public removeTask(taskId: string) {
    const task: Task | null = this.findTask(taskId);
    if (!task) throw new NotFoundException(`Task ${taskId} not found`);
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  private applyPagination(
    tasks: Task[],
    limit?: number,
    offset?: number,
  ): Task[] {
    let result = [...tasks];

    if (offset !== undefined && offset > 0) {
      result = result.slice(offset);
    }

    if (limit !== undefined && limit > 0) {
      result = result.slice(0, limit);
    }

    return result;
  }
}
