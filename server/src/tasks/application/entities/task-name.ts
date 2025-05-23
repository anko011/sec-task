import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '~/common/entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class TaskName extends BaseEntity {
  @ApiProperty()
  @Property()
  title: string;
}
