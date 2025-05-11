import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OrganizationType {
  @ApiProperty()
  public readonly id: string;

  constructor(
    id: string,
    private _name: string,
  ) {
    this.id = id;
  }

  set name(name: string) {
    this._name = name;
  }

  @ApiProperty()
  @Expose()
  get name() {
    return this._name;
  }
}
