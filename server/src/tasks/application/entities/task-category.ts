import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TaskCategory {
  @ApiProperty()
  public readonly id: string;

  public constructor(
    id: string,
    private _name: string,
    private _color: string,
  ) {
    this.id = id;
  }

  @ApiProperty()
  @Expose()
  public get name(): string {
    return this._name;
  }

  public set name(name: string) {
    //TODO: Consider adding a validation here
    this._name = name;
  }

  @ApiProperty()
  @Expose()
  public get color(): string {
    return this._color;
  }

  public set color(color: string) {
    //TODO: Consider adding a validation here
    //TODO: Consider adding a Color class here
    this._color = color;
  }
}
