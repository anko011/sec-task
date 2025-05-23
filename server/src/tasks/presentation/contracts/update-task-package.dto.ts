import { TaskPackageStatus } from '../../application/entities';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UpdateTaskDTO } from '~/tasks/presentation/contracts/update-task.dto';
import { CreateTaskDTO } from '~/tasks/presentation/contracts/create-task.dto';

class UpdateTaskDtoWithId extends UpdateTaskDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly id: string;
}

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

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachmentIds: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type((type) => {
    return type?.object.id ? UpdateTaskDtoWithId : CreateTaskDTO;
  })
  readonly tasks?: (UpdateTaskDtoWithId | CreateTaskDTO)[];
}
