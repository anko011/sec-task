import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { OrganizationType } from './organization-type';

export class Organization {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public type: OrganizationType;

  @ApiProperty()
  public isArchived: boolean;

  constructor(
    id: string,
    type: OrganizationType,
    private _name: string,
    isArchived: boolean,
  ) {
    this.id = id;
    this.type = type;
    this.isArchived = isArchived;
  }

  @ApiProperty()
  @Expose()
  public get name() {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }
}
