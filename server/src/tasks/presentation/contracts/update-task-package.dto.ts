import { TaskPackageStatus } from '../../application/entities';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskPackageDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly incomingRequisite?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly outgoingRequisite?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TaskPackageStatus)
  @IsOptional()
  readonly status?: TaskPackageStatus;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly assignedOrganizationIds?: string[];
}
