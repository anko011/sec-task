import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsExistingId } from '~/common/validators';
import { OrganizationType } from '~/organizations/applications/entities';
import { ToBoolean } from '~/common/decorators';

export class UpdateOrganizationDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public readonly name?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @IsExistingId(OrganizationType)
  public readonly typeId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  public readonly isArchived?: boolean;
}
