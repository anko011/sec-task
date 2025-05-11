import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskDangerStatus } from '../../application/entities';

export class CreateTaskDTO {
  @ApiProperty()
  @IsString()
  readonly additionalInformation?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly nameId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly number: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TaskDangerStatus)
  readonly dangerStatus: TaskDangerStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly categoryId: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  readonly BDU: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  readonly CVE: string[];
}
