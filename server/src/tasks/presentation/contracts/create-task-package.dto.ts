import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsString({ each: true })
  readonly assignedOrganizationIds: string[];
}
