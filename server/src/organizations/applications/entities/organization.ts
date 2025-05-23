import { ApiProperty } from '@nestjs/swagger';
import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';

import { BaseEntity } from '~/common/entities';
import { TaskPackage } from '~/tasks/application/entities';

import { OrganizationType } from './organization-type';

@Entity()
export class Organization extends BaseEntity {
  @ApiProperty()
  @Property()
  name: string;

  @ApiProperty()
  @ManyToOne(() => OrganizationType, {
    eager: true,
    deleteRule: 'cascade',
  })
  type: OrganizationType;

  @ApiProperty()
  @Property()
  isArchived: boolean;

  @ManyToMany(() => TaskPackage, (taskPackage) => taskPackage.organizations, {
    cascade: [Cascade.ALL],
    deleteRule: 'cascade',
  })
  packages: Collection<TaskPackage> = new Collection<TaskPackage>(this);
}
