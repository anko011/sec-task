import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '~/common/entities';

export type TaskCategoryFilterCriteria = {
  id?: string;
  name?: string;
  color?: string;
};

@Entity()
export class TaskCategory extends BaseEntity {
  @Property()
  title: string;

  @Property()
  color: string;
}
