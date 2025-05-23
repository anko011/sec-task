import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationTypeDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public readonly title?: string;
}
