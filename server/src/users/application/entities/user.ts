import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export enum Role {
  Admin = 'admin',
  Operator = 'operator',
  Assigner = 'assigner',
}

export class User {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public firstName: string;

  @ApiProperty()
  public secondName: string;

  @ApiProperty()
  public patronymic: string;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public role: Role;

  @ApiProperty()
  organizationId: string;

  @Exclude()
  public readonly password: string;

  constructor(
    id: string,
    firstName: string,
    secondName: string,
    patronymic: string,
    email: string,
    role: Role,
    password: string,
    organizationId: string,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.secondName = secondName;
    this.patronymic = patronymic;
    this.email = email;
    this.role = role;
    this.password = password;
    this.organizationId = organizationId;
  }
}
