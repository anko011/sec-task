import { ApiProperty } from '@nestjs/swagger';
import { Task, TaskDangerStatus, TaskStatus } from './task';
import {
  Cascade,
  Collection,
  Entity,
  EntityKey,
  Enum,
  Formula,
  ManyToMany,
  OneToMany,
  Opt,
  OptionalProps,
  Property,
  Reference,
  wrap,
} from '@mikro-orm/core';
import { BaseEntity } from '~/common/entities';
import { Organization } from '~/organizations/applications/entities';
import { CreateTaskCommand, UpdateTaskCommand } from '../commands/tasks';
import {
  CreateTaskPackageCommand,
  UpdateTaskPackageCommand,
} from '../commands/task-packages';
import { NotFoundException } from '@nestjs/common';
import { addDays, addHours, addMonths, isAfter, set } from 'date-fns';
import { Attachment } from '~/tasks/application/entities/attachment';

export enum TaskPackageStatus {
  ACTIVE = 'ACTIVE',
  FIXED = 'FIXED',
}

@Entity()
export class TaskPackage extends BaseEntity {
  [OptionalProps]: ['reportDeadline', 'nearestTaskDeadline'];

  @ApiProperty()
  @Property()
  incomingRequisite: string;

  @ApiProperty()
  @Property()
  outgoingRequisite: string;

  @ApiProperty()
  @Enum(() => TaskPackageStatus)
  status: TaskPackageStatus;

  @OneToMany(() => Attachment, (attachment) => attachment.taskPackage, {
    orphanRemoval: true,
    cascade: [Cascade.PERSIST, Cascade.MERGE, Cascade.REMOVE],
  })
  attachments = new Collection<Attachment>(this);

  @OneToMany(() => Task, (task) => task.taskPackage, {
    orphanRemoval: true,
    cascade: [Cascade.ALL],
  })
  tasks = new Collection<Task>(this);

  @ManyToMany(() => Organization, 'packages', {
    owner: true,
    cascade: [Cascade.PERSIST, Cascade.MERGE],
  })
  organizations = new Collection<Organization>(this);

  @ApiProperty()
  @Formula(
    (alias) =>
      `(SELECT COUNT(*) FROM task WHERE task_package_id = ${alias}.id)`,
  )
  @Property({ persist: false })
  tasksCount: number & Opt;

  @ApiProperty()
  @Formula(
    (alias) =>
      `(SELECT COUNT(*) FROM task_package_organizations WHERE task_package_id = ${alias}.id)`,
  )
  @Property({ persist: false })
  organizationsCount: number & Opt;

  @Formula(
    (alias) => `(
    SELECT 
      CASE 
        WHEN (SELECT COUNT(*) FROM task WHERE task_package_id = ${alias}.id) = 0 
          OR (SELECT COUNT(*) FROM task_package_organizations WHERE task_package_id = ${alias}.id) = 0 
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
            WHERE te.task_id IN (SELECT id FROM task WHERE task_package_id = ${alias}.id)
              AND last_status.new_status IN ('COMPLETED', 'NO_ACTUAL', 'COMPENSATED')
          ) * 100.0 / 
          (
            (SELECT COUNT(*) FROM task WHERE task_package_id = ${alias}.id) * 
            (SELECT COUNT(*) FROM task_package_organizations WHERE task_package_id = ${alias}.id)
          )
        )
      END
  )`,
  )
  @Property({ persist: false })
  completionPercentage: number & Opt;

  @ApiProperty()
  @Property({ persist: false })
  get reportDeadline(): Date {
    const dangerLevels = this.tasks.getItems().map((task) => task.dangerStatus);

    const hasCriticalTask = dangerLevels.includes(TaskDangerStatus.CRITICAL);
    const hasHighTask = dangerLevels.includes(TaskDangerStatus.HIGH);

    let preliminaryDeadline: Date;

    if (hasCriticalTask) {
      preliminaryDeadline = addHours(this.createdAt, 24);
    } else if (hasHighTask) {
      preliminaryDeadline = addDays(this.createdAt, 7);
    } else {
      preliminaryDeadline = set(addMonths(this.createdAt, 1), {
        date: 3,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
    }

    const maxAllowedDeadline = set(addMonths(this.createdAt, 1), {
      date: 3,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    if (isAfter(preliminaryDeadline, maxAllowedDeadline)) {
      return set(addMonths(this.createdAt, 2), {
        date: 3,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
    }

    return preliminaryDeadline;
  }

  @Property({ persist: false, nullable: true })
  get nearestTaskDeadline(): Date | undefined {
    const deadlines = this.tasks.getItems().map((task) => task.deadline);
    if (deadlines.length === 0) return undefined;
    return deadlines.reduce((min, curr) => (curr < min ? curr : min));
  }

  private onAddTaskHandlers?: ((task: Task) => void)[] = [];

  constructor(
    incomingRequisite: string,
    outgoingRequisite: string,
    status: TaskPackageStatus = TaskPackageStatus.ACTIVE,
  ) {
    super();
    this.incomingRequisite = incomingRequisite;
    this.outgoingRequisite = outgoingRequisite;
    this.status = status;
    this.onAddTaskHandlers = [];
  }

  static createFromDto(dto: CreateTaskPackageCommand['dto']): TaskPackage {
    const taskPackage = new TaskPackage(
      dto.incomingRequisite,
      dto.outgoingRequisite,
      dto.status,
    );

    taskPackage.organizations.set(
      dto.assignedOrganizationIds.map((id) =>
        Reference.createFromPK(Organization, id),
      ),
    );

    for (const taskDto of dto.tasks) {
      taskPackage.addTask(taskDto, dto.assignedOrganizationIds);
    }

    return taskPackage;
  }

  public update(dto: UpdateTaskPackageCommand['dto']): void {
    this.incomingRequisite = dto.incomingRequisite ?? this.incomingRequisite;
    this.outgoingRequisite = dto.outgoingRequisite ?? this.outgoingRequisite;

    this.status = dto.status ?? this.status;

    if (dto.attachmentIds) {
      for (const attachmentId of this.attachments.getIdentifiers()) {
        if (!dto.attachmentIds.includes(attachmentId)) {
          this.attachments.remove(
            Reference.createFromPK(Attachment, attachmentId),
          );
        }
      }
    }

    if (dto.assignedOrganizationIds) {
      this.organizations.set(
        dto.assignedOrganizationIds.map((id) =>
          Reference.createFromPK(Organization, id),
        ),
      );
    }

    this.updateTasks(dto.tasks, dto.assignedOrganizationIds);
  }

  public addTask(
    taskDto: CreateTaskCommand['dto'],
    organizationIds: string[],
  ): Task {
    const task = Task.createFromDto(this, taskDto, organizationIds);
    this.tasks.add(task);
    this.onAddTaskHandlers?.forEach((handler) => void handler(task));
    return task;
  }

  public removeTask(id: string): boolean {
    const task = this.tasks.getIdentifiers().find((id) => id === id);
    if (!task) throw new NotFoundException('Task with id ' + id + ' not found');

    this.tasks.remove(Reference.createFromPK(Task, id));
    return true;
  }

  public updateTask(id: string, taskDto: UpdateTaskCommand['dto']): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new NotFoundException('Task with id ' + id + ' not found');
    task.update(taskDto, this.organizations.getIdentifiers());
    return task;
  }

  public updateTaskStatus(
    organizationId: string,
    taskId: string,
    status: TaskStatus,
    comment: string,
  ) {
    const task = this.tasks.find((t) => t.id === taskId);

    if (!task)
      throw new NotFoundException('Task with id ' + taskId + ' not found');

    task.updateStatus(organizationId, status, comment);
  }

  public fix(): boolean {
    const canFix = this.tasks
      .map((t) => t.isCompletedAllOrganizations)
      .every((t) => t);

    if (!canFix) return false;

    this.status = TaskPackageStatus.FIXED;
    return true;
  }

  public addOnAddTask(handler: (task: Task) => void) {
    if (!this.onAddTaskHandlers) this.onAddTaskHandlers = [];
    this.onAddTaskHandlers.push(handler);
  }

  public toJSON(...args: EntityKey<TaskPackage>[]): { [p: string]: any } {
    const dto = wrap<TaskPackage>(this, true).toObject([...args]);

    return {
      ...dto,
      tasks: this.tasks.getIdentifiers(),
      organizations: this.organizations.getIdentifiers(),
    };
  }

  private updateTasks(
    taskDtos: UpdateTaskPackageCommand['dto']['tasks'],
    assignedOrganizationIds: string[] | undefined,
  ): void {
    const toUpdate = taskDtos.filter((t) => 'id' in t);
    const toCreate = taskDtos.filter((t) => !('id' in t));

    const toUpdateIds = toUpdate.map((t) => t.id);
    const taskIds: Set<string> = new Set(toUpdateIds);

    this.tasks.getItems().forEach((t) => {
      if (!toUpdateIds.includes(t.id)) return;
      const dto = toUpdate.find((d) => d.id === t.id);
      if (!dto) return;
      t.update(
        dto,
        assignedOrganizationIds ?? this.organizations.getIdentifiers(),
      );
    });

    toCreate.forEach((dto) => {
      const task = this.addTask(
        dto as CreateTaskCommand['dto'],
        assignedOrganizationIds ?? this.organizations.getIdentifiers(),
      );
      taskIds.add(task.id);
    });

    const toRemove = this.tasks
      .getItems()
      .filter((task) => !taskIds.has(task.id));

    this.tasks.remove(toRemove);
  }
}
