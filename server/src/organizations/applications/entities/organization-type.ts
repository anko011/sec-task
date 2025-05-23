import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '~/common/entities';

@Entity()
export class OrganizationType extends BaseEntity {
  @Property()
  title: string;
}
