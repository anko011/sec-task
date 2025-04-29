import { ApiProperty } from '@nestjs/swagger';

export enum Role {
  Admin = 'admin',
  Operator = 'operator',
  Assigner = 'assigner',
}

export class User {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly firstName: string;

  @ApiProperty()
  public readonly secondName: string;

  @ApiProperty()
  public readonly patronymic: string;

  @ApiProperty()
  public readonly email: string;

  @ApiProperty()
  public readonly role: Role;

  @ApiProperty()
  public readonly password: string;

  constructor(
    id: string,
    firstName: string,
    secondName: string,
    patronymic: string,
    email: string,
    role: Role,
    password: string,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.secondName = secondName;
    this.patronymic = patronymic;
    this.email = email;
    this.role = role;
    this.password = password;
  }
}
