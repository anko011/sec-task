import {
  BaseEntity as MikroBaseEntity,
  Opt,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity extends MikroBaseEntity {
  @ApiProperty()
  @PrimaryKey()
  id: string = v4();

  @ApiProperty({ type: Date })
  @Property({ onCreate: () => new Date() })
  createdAt: Date & Opt = new Date();

  @ApiProperty({ type: Date })
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();
}
