import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

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
  public readonly typeId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'on')
  @IsOptional()
  public readonly isArchived?: boolean;
}
