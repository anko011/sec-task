import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsExistingId } from '~/common/validators';
import { OrganizationType } from '~/organizations/applications/entities';
import { ToBoolean } from '~/common/decorators';

export class CreateOrganizationDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Обязательное поле' })
  public readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Обязательное поле' })
  @IsExistingId(OrganizationType)
  public readonly typeId: string;

  @ApiProperty()
  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  public readonly isArchived?: boolean;
}
