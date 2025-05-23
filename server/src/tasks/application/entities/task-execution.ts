import {
  Cascade,
  Collection,
  Entity,
  Formula,
  ManyToOne,
  OneToMany,
} from '@mikro-orm/core';

import { BaseEntity } from '~/common/entities';
import { Organization } from '~/organizations/applications/entities';

import { TaskPackage } from './task-package';
import { Task, TaskStatus } from './task';
import { TaskStatusHistory } from './task-status-history';
import { BadRequestException } from '@nestjs/common';

@Entity()
export class TaskExecution extends BaseEntity {
  @Formula(
    (alias) =>
      `(SELECT new_status
       FROM task_status_history
       WHERE execution_id = ${alias}.id
       ORDER BY updated_at DESC LIMIT 1)`,
  )
  lastStatus: TaskStatus;

  @ManyToOne(() => TaskPackage, {
    cascade: [Cascade.PERSIST],
    deleteRule: 'cascade',
  })
  taskPackage: TaskPackage;

  @ManyToOne(() => Organization, {
    cascade: [Cascade.PERSIST],
    deleteRule: 'cascade',
  })
  organization: Organization;

  @ManyToOne(() => Task, { cascade: [Cascade.PERSIST], deleteRule: 'cascade' })
  task: Task;

  @OneToMany(() => TaskStatusHistory, (history) => history.execution, {
    orphanRemoval: true,
    cascade: [Cascade.ALL],
  })
  statusHistories = new Collection<TaskStatusHistory>(this);

  constructor(
    taskPackage: TaskPackage,
    organization: Organization,
    task: Task,
  ) {
    super();
    this.taskPackage = taskPackage;
    this.organization = organization;
    this.task = task;
    this.changeStatus(TaskStatus.NEW, 'Задание создано');
  }

  public changeStatus(status: TaskStatus, comment: string) {
    if (this.lastStatus) {
      this.validateStatusTransition(this.lastStatus, status);
    }

    this.statusHistories.add(
      new TaskStatusHistory(this, comment, status, this.lastStatus),
    );
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
}
