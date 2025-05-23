import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { IsExistingId } from '~/common/validators';
import { Organization } from '~/organizations/applications/entities';

import { CreateTaskDTO } from './create-task.dto';

export class CreateTaskPackageDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Обязательное поле' })
  @IsString()
  readonly incomingRequisite: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Обязательное поле' })
  @IsString()
  readonly outgoingRequisite: string;

  @ApiProperty()
  @IsArray()
  @IsExistingId(Organization, { each: true })
  readonly assignedOrganizationIds: string[];

  @ApiProperty({ type: [CreateTaskDTO] })
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDTO)
  readonly tasks: CreateTaskDTO[];
}
