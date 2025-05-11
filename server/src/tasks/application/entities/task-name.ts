import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export type TaskNameFilterCriteria = {
  id?: string;
  name?: string;
};

export class TaskName {
  @ApiProperty()
  public readonly id: string;

  private _name: string;

  public constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  @ApiProperty()
  @Expose()
  public get name(): string {
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

  update(dto: { readonly id: string; readonly name?: string }) {
    this.name = dto.name ?? this.name;
  }
}
