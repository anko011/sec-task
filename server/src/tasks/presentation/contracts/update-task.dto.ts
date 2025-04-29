import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { TaskCategory, TaskDangerStatus } from '../../application/entities';

export class UpdateTaskDTO {
  @IsString()
  @MinLength(1)
  @IsOptional()
  public name?: string;

  @IsUUID(4)
  @IsOptional()
  public readonly packageId?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  public description?: string;

  @IsEnum(TaskCategory)
  @IsOptional()
  public category?: TaskCategory;

  @IsEnum(TaskDangerStatus)
  @IsOptional()
  public dangerStatus?: TaskDangerStatus;
}
