import { ApiProperty } from '@nestjs/swagger';
import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';

import { BaseEntity } from '~/common/entities';
import { TaskPackage } from '~/tasks/application/entities';

import { OrganizationType } from './organization-type';
import { User } from '~/users/application/entities';

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

  @OneToMany(() => User, (user) => user.organization)
  users = new Collection<User>(this);

  @ManyToMany(() => TaskPackage, (taskPackage) => taskPackage.organizations, {
    cascade: [Cascade.MERGE, Cascade.PERSIST],
  })
  packages: Collection<TaskPackage> = new Collection<TaskPackage>(this);
}
