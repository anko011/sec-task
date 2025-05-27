import { ApiProperty } from '@nestjs/swagger';
import {
  Cascade,
  Collection,
  Entity,
  Enum,
  Formula,
  ManyToOne,
  OneToMany,
  Opt,
  OptionalProps,
  Property,
  Reference,
} from '@mikro-orm/core';
import { addDays, addHours, addMonths, addWeeks } from 'date-fns';

import { BaseEntity } from '~/common/entities';

import { TaskName } from './task-name';
import { TaskPackage } from './task-package';
import { TaskCategory } from './task-category';
import {
  CreateTaskCommand,
  UpdateTaskCommand,
} from '~/tasks/application/commands/tasks';
import { TaskExecution } from '~/tasks/application/entities/task-execution';
import { Organization } from '~/organizations/applications/entities';
import { NotFoundException } from '@nestjs/common';

export enum TaskStatus {
  COMPENSATED = 'COMPENSATED',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  NEW = 'NEW',
  NO_ACTUAL = 'NO_ACTUAL',
}

export enum TaskDangerStatus {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
}

@Entity()
export class Task extends BaseEntity {
  [OptionalProps]: ['deadline', 'isCompletedAllOrganizations'];

  @ApiProperty()
  @Property({ nullable: true })
  additionalInformation?: string | Opt;

  @ApiProperty()
  @Property()
  number: string;

  @ApiProperty()
  @Property()
  description: string;

  @ApiProperty()
  @Property({ type: 'string[]' })
  bdu: string[];

  @ApiProperty()
  @Property({ type: 'string[]' })
  cve: string[];

  @ApiProperty()
  @Enum(() => TaskDangerStatus)
  dangerStatus: TaskDangerStatus;

  @ApiProperty()
  @ManyToOne(() => TaskName, {
    cascade: [Cascade.PERSIST],
    deleteRule: 'cascade',
  })
  name: TaskName;

  @OneToMany(() => TaskExecution, (taskExecution) => taskExecution.task, {
    orphanRemoval: true,
    cascade: [Cascade.ALL],
  })
  executions = new Collection<TaskExecution>(this);

  @ApiProperty()
  @ManyToOne(() => TaskCategory, {
    cascade: [Cascade.PERSIST],
    deleteRule: 'cascade',
  })
  category: TaskCategory;

  @ApiProperty({ type: () => TaskPackage })
  @ManyToOne(() => TaskPackage, {
    cascade: [Cascade.PERSIST],
    deleteRule: 'cascade',
  })
  taskPackage: TaskPackage;

  @ApiProperty()
  @Property({ persist: false, type: 'datetime', getter: true })
  get deadline(): Date {
    return (
      {
        [TaskDangerStatus.CRITICAL]: () => addHours(this.createdAt, 24),
        [TaskDangerStatus.HIGH]: () => addDays(this.createdAt, 7),
        [TaskDangerStatus.MEDIUM]: () => addWeeks(this.createdAt, 4),
        [TaskDangerStatus.LOW]: () => addMonths(this.createdAt, 4),
      }[this.dangerStatus]?.() ?? addMonths(this.createdAt, 4)
    );
  }

  @Formula(
    (alias) => `(
      SELECT COUNT(*)
      FROM task_execution te
      JOIN (
        SELECT tsh.execution_id, tsh.new_status
        FROM task_status_history tsh
        JOIN (
          SELECT execution_id, MAX(updated_at) as max_updated_at
          FROM task_status_history
          GROUP BY execution_id
        ) latest ON tsh.execution_id = latest.execution_id AND tsh.updated_at = latest.max_updated_at
      ) last_status ON last_status.execution_id = te.id
      WHERE te.task_id = ${alias}.id
        AND last_status.new_status IN ('COMPLETED', 'NO_ACTUAL', 'COMPENSATED')
    )`,
  )
  @Property({ persist: false })
  completedOrganizationsCount: number & Opt;

  @Formula(
    (alias) => `(
      SELECT 
        CASE 
          WHEN (SELECT COUNT(*) FROM task_execution WHERE task_id = ${alias}.id) = 0 
          THEN 0 
          ELSE ROUND(
            (
              SELECT COUNT(*)
              FROM task_execution te
              JOIN (
                SELECT tsh.execution_id, tsh.new_status
                FROM task_status_history tsh
                JOIN (
                  SELECT execution_id, MAX(updated_at) as max_updated_at
                  FROM task_status_history
                  GROUP BY execution_id
                ) latest ON tsh.execution_id = latest.execution_id AND tsh.updated_at = latest.max_updated_at
              ) last_status ON last_status.execution_id = te.id
              WHERE te.task_id = ${alias}.id
                AND last_status.new_status IN ('COMPLETED', 'NO_ACTUAL', 'COMPENSATED')
            ) * 100.0 / 
            (SELECT COUNT(*) FROM task_execution WHERE task_id = ${alias}.id)
          )
        END
    )`,
  )
  @Property({ persist: false })
  progress: number & Opt;

  private onDangerStatusIncreasedHandlers: ((
    task: Task,
    oldStatus: TaskDangerStatus,
  ) => void)[] = [];

  constructor(
    taskPackage: TaskPackage,
    name: TaskName,
    category: TaskCategory,
    dangerStatus: TaskDangerStatus,
    number: string,
    description: string,
    bdu: string[],
    cve: string[],
    additionalInformation?: string | Opt,
  ) {
    super();
    this.additionalInformation = additionalInformation;
    this.number = number;
    this.description = description;
    this.bdu = bdu;
    this.cve = cve;
    this.dangerStatus = dangerStatus;
    this.name = name;
    this.category = category;
    this.taskPackage = taskPackage;
  }

  static createFromDto(
    taskPackage: TaskPackage,
    dto: CreateTaskCommand['dto'],
    organizationIds: string[],
  ) {
    const name = Reference.createNakedFromPK(TaskName, dto.nameId);
    const category = Reference.createNakedFromPK(TaskCategory, dto.categoryId);
    const task = new Task(
      taskPackage,
      name,
      category,
      dto.dangerStatus,
      dto.number,
      dto.description,
      dto.bdu,
      dto.cve,
      dto.additionalInformation,
    );

    for (const organizationId of organizationIds) {
      task.executions.add(
        new TaskExecution(
          taskPackage,
          Reference.createNakedFromPK(Organization, organizationId),
          task,
        ),
      );
    }

    return task;
  }

  public isMoreCriticalThan(other: TaskDangerStatus): boolean {
    const order = [
      TaskDangerStatus.LOW,
      TaskDangerStatus.MEDIUM,
      TaskDangerStatus.HIGH,
      TaskDangerStatus.CRITICAL,
    ];
    return order.indexOf(this.dangerStatus) > order.indexOf(other);
  }

  public addOnDangerStatusIncreased(
    handler: (task: Task, oldStatus: TaskDangerStatus) => void,
  ) {
    if (!this.onDangerStatusIncreasedHandlers)
      this.onDangerStatusIncreasedHandlers = [];
    this.onDangerStatusIncreasedHandlers.push(handler);
  }

  public update(dto: UpdateTaskCommand['dto'], organizationIds: string[]) {
    const oldDangerStatus = this.dangerStatus;

    this.name = dto.nameId
      ? Reference.createNakedFromPK(TaskName, dto.nameId)
      : this.name;

    this.category = dto.categoryId
      ? Reference.createNakedFromPK(TaskCategory, dto.categoryId)
      : this.category;

    this.number = dto.number ?? this.number;
    this.description = dto.description ?? this.description;
    this.dangerStatus = dto.dangerStatus ?? this.dangerStatus;
    this.bdu = dto.bdu ?? this.bdu;
    this.cve = dto.cve ?? this.cve;
    this.additionalInformation =
      dto.additionalInformation ?? this.additionalInformation;

    for (const organizationId of organizationIds) {
      const isExistExecution = this.executions.exists(
        (execution) => execution.organization.id === organizationId,
      );

      if (!isExistExecution) {
        const organization = Reference.createNakedFromPK(
          Organization,
          organizationId,
        );
        this.executions.add(
          new TaskExecution(this.taskPackage, organization, this),
        );
      }
    }

    const executions = this.executions.map(({ id, organization }) => ({
      id,
      organizationId: organization.id,
    }));

    for (const execution of executions) {
      if (!organizationIds.includes(execution.organizationId)) {
        this.executions.remove(
          Reference.createFromPK(TaskExecution, execution.id),
        );
      }
    }

    if (
      dto.dangerStatus &&
      this.dangerStatus !== oldDangerStatus &&
      this.isMoreCriticalThan(oldDangerStatus)
    ) {
      this.onDangerStatusIncreasedHandlers.forEach((handler) =>
        handler(this, oldDangerStatus),
      );
    }
  }

  public updateStatus(
    organizationId: string,
    status: TaskStatus,
    comment: string,
  ) {
    const execution = this.executions.find(
      (t) => t.organization.id === organizationId,
    );

    if (!execution) throw new NotFoundException('Execution not found');

    execution.changeStatus(status, comment);
  }

  get isCompletedAllOrganizations(): boolean {
    return this.executions
      .map((e) => e.lastStatus)
      .every(
        (status) =>
          !(status == TaskStatus.NEW || status == TaskStatus.IN_PROGRESS),
      );
  }
}
