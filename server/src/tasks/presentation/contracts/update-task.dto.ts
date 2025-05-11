import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskDangerStatus } from '../../application/entities';

export class UpdateTaskDTO {
  @IsString()
  @IsNotEmpty()
  readonly additionalInformation?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly nameId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly number?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TaskDangerStatus)
  readonly dangerStatus?: TaskDangerStatus;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly categoryId?: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  readonly BDU?: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  readonly CVE?: string[];
}
