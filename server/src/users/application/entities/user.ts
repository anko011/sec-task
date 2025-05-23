import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '~/common/entities';
import { Entity, Enum, ManyToOne, Property, Reference } from '@mikro-orm/core';
import { Organization } from '~/organizations/applications/entities';

export enum Role {
  Admin = 'admin',
  Operator = 'operator',
  Assigner = 'assigner',
  Supervisor = 'supervisor',
}

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @Property()
  firstName: string;

  @ApiProperty()
  @Property()
  secondName: string;

  @ApiProperty()
  @Property()
  patronymic: string;

  @ApiProperty()
  @Property()
  email: string;

  @ApiProperty()
  @Enum(() => Role)
  role: Role;

  @ApiProperty()
  @ManyToOne(() => Organization, { nullable: true })
  organization: Organization;

  @Exclude()
  @Property()
  readonly password: string;

  constructor(
    firstName: string,
    secondName: string,
    patronymic: string,
    email: string,
    role: Role,
    password: string,
    organizationId?: string | null,
  ) {
    super();
    this.firstName = firstName;
    this.secondName = secondName;
    this.patronymic = patronymic;
    this.email = email;
    this.role = role;
    this.password = password;
    if (organizationId) {
      this.organization = Reference.createNakedFromPK(
        Organization,
        organizationId,
      );
    }
  }
}
