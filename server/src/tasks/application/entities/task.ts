import { TaskCategory } from './task-category';
import { TaskDangerStatus } from './task-danger-status';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class Task {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public category: TaskCategory;

  @ApiProperty()
  public dangerStatus: TaskDangerStatus;

  @ApiProperty()
  public readonly packageId: string;

  public constructor(
    id: string,
    private _name: string,
    private _description: string,
    category: TaskCategory,
    dangerStatus: TaskDangerStatus,
    packageId: string,
  ) {
    this.id = id;
    this.category = category;
    this.dangerStatus = dangerStatus;
    this.packageId = packageId;
  }

  @ApiProperty()
  @Expose()
  public get description(): string {
    return this._description;
  }

  public set description(description: string) {
    //TODO: Consider adding a validation here
    this._description = description;
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

  public update(dto: {
    readonly name?: string;
    readonly description?: string;
    readonly category?: TaskCategory;
    readonly dangerStatus?: TaskDangerStatus;
  }) {
    this._name = dto.name ?? this._name;
    this._description = dto.description ?? this._description;
    this.category = dto.category ?? this.category;
    this.dangerStatus = dto.dangerStatus ?? this.dangerStatus;
  }
}
