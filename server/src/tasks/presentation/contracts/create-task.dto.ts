import { IsEnum, IsString, MinLength } from 'class-validator';
import { TaskDangerStatus } from '../../application/entities';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDTO {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  public name: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  public description: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  public categoryId: string;

  @IsEnum(TaskDangerStatus)
  @ApiProperty()
  public dangerStatus: TaskDangerStatus;
}
