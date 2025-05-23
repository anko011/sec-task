import { ApiProperty } from '@nestjs/swagger';
import { Cascade, Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';

import { BaseEntity } from '~/common/entities';

import { TaskExecution } from './task-execution';
import { TaskStatus } from './task';

@Entity()
export class TaskStatusHistory extends BaseEntity {
  @ApiProperty()
  @Property({ nullable: true })
  @Enum(() => TaskStatus)
  oldStatus?: TaskStatus;

  @ApiProperty()
  @Enum(() => TaskStatus)
  newStatus: TaskStatus;

  @ApiProperty()
  @Property()
  comment: string;

  @ApiProperty()
  @ManyToOne(() => TaskExecution, {
    cascade: [Cascade.PERSIST],
    deleteRule: 'cascade',
  })
  execution: TaskExecution;

  constructor(
    execution: TaskExecution,
    comment: string,
    newStatus: TaskStatus,
    oldStatus?: TaskStatus,
  ) {
    super();
    this.oldStatus = oldStatus;
    this.newStatus = newStatus;
    this.comment = comment;
    this.execution = execution;
  }
}
