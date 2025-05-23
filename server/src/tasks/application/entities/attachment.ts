import { Cascade, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { TaskPackage } from './task-package';
import { BaseEntity } from '~/common/entities';

@Entity()
export class Attachment extends BaseEntity {
  @Property()
  filename: string;

  @Property()
  path: string;

  @Property()
  mimetype: string;

  @ManyToOne(() => TaskPackage, {
    deleteRule: 'cascade',
    cascade: [Cascade.ALL],
  })
  taskPackage: TaskPackage;

  constructor(
    filename: string,
    path: string,
    mimetype: string,
    taskPackage: TaskPackage,
  ) {
    super();
    this.filename = filename;
    this.path = path;
    this.mimetype = mimetype;
    this.taskPackage = taskPackage;
  }
}
