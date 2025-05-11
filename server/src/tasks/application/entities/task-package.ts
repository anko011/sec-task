import { BadRequestException } from '@nestjs/common';
import { v4 } from 'uuid';

import { TaskDangerStatus } from './task-danger-status';
import { TaskCategory } from './task-category';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TaskName } from './task-name';
import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  isAfter,
  setDate,
} from 'date-fns';

export enum TaskPackageStatus {
  ACTIVE = 'ACTIVE',
  FIXED = 'FIXED',
}

export enum TaskStatus {
  COMPENSATED = 'COMPENSATED',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  NEW = 'NEW',
  NO_ACTUAL = 'NO_ACTUAL',
}

interface TaskStatusHistory {
  oldStatus: TaskStatus;
  newStatus: TaskStatus;
  changedAt: Date;
  comment?: string;
}

export class TaskExecution {
  public readonly taskId: string;
  public readonly organizationId: string;
  public status: TaskStatus;
  public readonly statusHistory: TaskStatusHistory[] = [];
}

export type TaskFilterCriteria = {
  id?: string;
  additionalInformation?: string;
  nameId?: string;
  number?: string;
  description?: string;
  dangerStatus?: TaskDangerStatus;
  categoryId?: string;
};

export class Task {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  additionalInformation: string;

  @ApiProperty()
  name: TaskName;

  @ApiProperty()
  number: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  dangerStatus: TaskDangerStatus;

  @ApiProperty()
  category: TaskCategory;

  @ApiProperty()
  BDU: string[];

  @ApiProperty()
  CVE: string[];

  @ApiProperty()
  deadline: Date; // Новое поле для хранения дедлайна задачи

  constructor(
    private readonly _package: TaskPackage,
    id: string,
    name: TaskName,
    number: string,
    description: string,
    additionalInformation: string,
    BDU: string[],
    CVE: string[],
    dangerStatus: TaskDangerStatus,
    category: TaskCategory,
    private readonly createdAt: Date, // Добавляем дату создания
  ) {
    this.id = id;
    this.additionalInformation = additionalInformation;
    this.name = name;
    this.number = number;
    this.description = description;
    this.dangerStatus = dangerStatus;
    this.category = category;
    this.BDU = BDU;
    this.CVE = CVE;
    this.deadline = this.calculateDeadline(createdAt); // Рассчитываем дедлайн при создании
  }

  @Expose()
  @ApiProperty({ enum: TaskStatus, enumName: 'TaskStatus' })
  get status(): TaskStatus {
    const taskExecutions = this._package.taskExecutions.filter(
      (te) => te.taskId === this.id,
    );

    if (taskExecutions.length === 0) {
      return TaskStatus.NEW;
    }

    const lastStatuses = taskExecutions.map((execution) => {
      if (execution.statusHistory.length === 0) {
        return {
          status: execution.status,
          changedAt: this.createdAt,
        };
      }

      const lastChange = execution.statusHistory.reduce((latest, current) =>
        current.changedAt > latest.changedAt ? current : latest,
      );

      return {
        status: lastChange.newStatus,
        changedAt: lastChange.changedAt,
      };
    });

    const overallLastStatus = lastStatuses.reduce((latest, current) =>
      current.changedAt > latest.changedAt ? current : latest,
    );

    return overallLastStatus.status;
  }

  @Expose()
  get progress() {
    if (!this._package) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const executions = this._package.taskExecutions.filter(
      (te) => te.taskId === this.id,
    );
    const completed = executions.filter(
      (te) => te.status === TaskStatus.COMPLETED,
    ).length;
    const total = executions.length;

    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  private calculateDeadline(createdAt: Date): Date {
    switch (this.dangerStatus) {
      case TaskDangerStatus.CRITICAL:
        return addHours(createdAt, 24);
      case TaskDangerStatus.HIGH:
        return addDays(createdAt, 7);
      case TaskDangerStatus.MEDIUM:
        return addWeeks(createdAt, 4);
      case TaskDangerStatus.LOW:
        return addMonths(createdAt, 4);
      default:
        return addMonths(createdAt, 4);
    }
  }

  update(dto: UpdateTaskDTO) {
    this.name = dto.name ?? this.name;
    this.number = dto.number ?? this.number;
    this.description = dto.description ?? this.description;
    this.additionalInformation =
      dto.additionalInformation ?? this.additionalInformation;
    this.dangerStatus = dto.dangerStatus ?? this.dangerStatus;
    this.category = dto.category ?? this.category;
    this.BDU = dto.BDU ?? this.BDU;
    this.CVE = dto.CVE ?? this.CVE;

    // При изменении dangerStatus нужно пересчитать дедлайн
    if (dto.dangerStatus) {
      this.deadline = this.calculateDeadline(this.createdAt);
    }
  }
}

export type CreateTaskDTO = {
  readonly additionalInformation?: string;
  readonly name: TaskName;
  readonly number: string;
  readonly description: string;
  readonly dangerStatus: TaskDangerStatus;
  readonly category: TaskCategory;
  readonly BDU: string[];
  readonly CVE: string[];
};

export type UpdateTaskDTO = Partial<CreateTaskDTO> & { id: string };

export type UpdateTaskPackageDTO = {
  incomingRequisite?: string;
  outgoingRequisite?: string;
  status?: TaskPackageStatus;
  assignedOrganizationIds?: string[];
};

export class TaskPackage {
  public readonly id: string;
  public _incomingRequisite: string;
  public _outgoingRequisite: string;
  private _status: TaskPackageStatus;

  @ApiProperty()
  public tasks: Task[] = [];

  @ApiProperty()
  public createdAt: Date;

  private _assignedOrganizationIds: string[] = [];
  private _taskExecutions: TaskExecution[] = [];

  constructor(
    id: string,
    incomingRequisite: string,
    outgoingRequisite: string,
    status: TaskPackageStatus,
    assignedOrganizationIds: string[],
    createdAt: Date,
  ) {
    this.id = id;
    this._incomingRequisite = incomingRequisite;
    this._outgoingRequisite = outgoingRequisite;
    this._status = status;
    this._assignedOrganizationIds = assignedOrganizationIds;
    this.createdAt = createdAt;
  }

  @ApiProperty()
  @Expose()
  get tasksCount() {
    return this.tasks.length;
  }

  @ApiProperty()
  @Expose()
  get assignedOrganizationCount() {
    return this.assignedOrganizationIds.length;
  }

  @ApiProperty()
  @Expose()
  get incomingRequisite() {
    return this._incomingRequisite;
  }

  set incomingRequisite(value: string) {
    this._incomingRequisite = value;
  }

  @ApiProperty()
  @Expose()
  get outgoingRequisite() {
    return this._outgoingRequisite;
  }

  set outgoingRequisite(value: string) {
    this._outgoingRequisite = value;
  }

  @ApiProperty()
  @Expose()
  get status(): TaskPackageStatus {
    return this._status;
  }

  set status(value: TaskPackageStatus) {
    this._status = value;
  }

  @ApiProperty()
  @Expose()
  get assignedOrganizationIds(): string[] {
    return this._assignedOrganizationIds;
  }

  set assignedOrganizationIds(value: string[]) {
    this._assignedOrganizationIds = value;
  }

  @ApiProperty()
  @Expose()
  get taskExecutions(): TaskExecution[] {
    return this._taskExecutions;
  }

  set taskExecutions(value: TaskExecution[]) {
    this._taskExecutions = value;
  }

  changeTaskStatus(
    taskId: string,
    organizationId: string,
    newStatus: TaskStatus,
    comment?: string,
  ): TaskExecution {
    const execution = this.taskExecutions.find(
      (te) => te.taskId === taskId && te.organizationId === organizationId,
    );

    if (!execution) {
      throw new BadRequestException(
        `Task execution not found for task ${taskId} and organization ${organizationId}`,
      );
    }

    this.validateStatusTransition(execution.status, newStatus);

    execution.statusHistory.push({
      oldStatus: execution.status,
      newStatus,
      changedAt: new Date(),
      comment,
    });

    execution.status = newStatus;

    return execution;
  }

  private validateStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ) {
    const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
      [TaskStatus.NEW]: [
        TaskStatus.IN_PROGRESS,
        TaskStatus.COMPLETED,
        TaskStatus.COMPENSATED,
        TaskStatus.NO_ACTUAL,
      ],
      [TaskStatus.IN_PROGRESS]: [
        TaskStatus.COMPLETED,
        TaskStatus.NO_ACTUAL,
        TaskStatus.COMPENSATED,
      ],
      [TaskStatus.COMPLETED]: [TaskStatus.IN_PROGRESS],
      [TaskStatus.COMPENSATED]: [TaskStatus.IN_PROGRESS],
      [TaskStatus.NO_ACTUAL]: [TaskStatus.IN_PROGRESS],
    };

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  update(dto: UpdateTaskPackageDTO) {
    this.incomingRequisite = dto.incomingRequisite ?? this.incomingRequisite;
    this.outgoingRequisite = dto.outgoingRequisite ?? this.outgoingRequisite;
    this.status = dto.status ?? this.status;

    const createOrganizationIds = (dto.assignedOrganizationIds ?? []).filter(
      (id) => !this.assignedOrganizationIds.includes(id),
    );

    this.tasks.forEach((task) => {
      createOrganizationIds.forEach((organizationid) => {
        this.taskExecutions.push({
          taskId: task.id,
          organizationId: organizationid,
          statusHistory: [],
          status: TaskStatus.NEW,
        });
      });
    });

    const deleteOrganizationIds = this.assignedOrganizationIds.filter(
      (id) => !(dto.assignedOrganizationIds ?? []).includes(id),
    );

    this.taskExecutions = this._taskExecutions.filter(
      (execution) => !deleteOrganizationIds.includes(execution.organizationId),
    );

    this.assignedOrganizationIds =
      dto.assignedOrganizationIds ?? this.assignedOrganizationIds;
  }

  addTask(taskData: CreateTaskDTO): Task {
    const id = v4();
    const task = new Task(
      this,
      id,
      taskData.name,
      taskData.number,
      taskData.description,
      taskData.additionalInformation ?? '',
      taskData.BDU ?? [],
      taskData.CVE ?? [],
      taskData.dangerStatus,
      taskData.category,
      this.createdAt,
    );

    this.tasks.push(task);

    this.assignedOrganizationIds.forEach((orgId) => {
      this.taskExecutions.push({
        taskId: id,
        organizationId: orgId,
        statusHistory: [],
        status: TaskStatus.NEW,
      });
    });

    return task;
  }

  removeTask(taskOrId: Task | string) {
    const taskId = typeof taskOrId === 'string' ? taskOrId : taskOrId.id;
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.taskExecutions = this.taskExecutions.filter(
      (execution) => execution.taskId !== taskId,
    );
  }

  updateTask(taskDTO: UpdateTaskDTO): Task {
    const task = this.tasks.find(({ id }) => id === taskDTO.id);
    if (!task)
      throw new BadRequestException(`Task with id ${taskDTO.id} not found`);

    task.update(taskDTO);
    return task;
  }

  private removeTaskExecutions(taskId: string) {
    this._taskExecutions = this._taskExecutions.filter(
      (te) => te.taskId !== taskId,
    );
  }

  @Expose()
  @ApiProperty()
  public get reportDeadline(): { deadline: Date; needsPostpone: boolean } {
    const criticalHighTasks = this.tasks.filter(
      (task) =>
        task.dangerStatus === TaskDangerStatus.CRITICAL ||
        task.dangerStatus === TaskDangerStatus.HIGH,
    );

    // Если есть критические/высокие уязвимости
    if (criticalHighTasks.length > 0) {
      const maxFixDeadline = criticalHighTasks.reduce((max, task) => {
        return task.deadline > max ? task.deadline : max;
      }, new Date(0));

      const reportDeadline = addDays(maxFixDeadline, 1);
      const nextMonth3rd = this.getNextMonth3rd();

      return {
        deadline: reportDeadline,
        needsPostpone: isAfter(reportDeadline, nextMonth3rd),
      };
    }

    // Если только средние/низкие уязвимости
    return {
      deadline: this.getNextMonth3rd(),
      needsPostpone: false,
    };
  }

  private getNextMonth3rd(): Date {
    const nextMonth = addMonths(this.createdAt, 1);
    return setDate(nextMonth, 3);
  }

  @Expose()
  @ApiProperty()
  public get submissionData(): Date {
    const { deadline, needsPostpone } = this.reportDeadline;

    if (needsPostpone) {
      // Перенос: 5 число месяца после месяца дедлайна
      const deadlineMonth = new Date(
        deadline.getFullYear(),
        deadline.getMonth(),
        1,
      );
      return setDate(addMonths(deadlineMonth, 1), 5);
    }

    // Стандартный срок: 5 число следующего месяца от создания пакета
    return setDate(addMonths(this.createdAt, 1), 5);
  }
}
