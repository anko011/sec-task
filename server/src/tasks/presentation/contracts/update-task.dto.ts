import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskDangerStatus } from '../../application/entities';

export class UpdateTaskDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly additionalInformation?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly nameId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly number?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TaskDangerStatus)
  @IsOptional()
  readonly dangerStatus?: TaskDangerStatus;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly categoryId?: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  readonly bdu?: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  readonly cve?: string[];
}
