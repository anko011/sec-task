import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsExistingId } from '~/common/validators';
import {
  TaskCategory,
  TaskDangerStatus,
  TaskName,
} from '../../application/entities';

export class CreateTaskDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Обязательное поле' })
  @IsString()
  @IsExistingId(TaskName)
  readonly nameId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Обязательное поле' })
  @IsString()
  @IsExistingId(TaskCategory)
  readonly categoryId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Обязательное поле' })
  @IsString()
  readonly number: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Обязательное поле' })
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Обязательное поле' })
  @IsEnum(TaskDangerStatus)
  readonly dangerStatus: TaskDangerStatus;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  readonly bdu: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  readonly cve: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly additionalInformation?: string;
}
