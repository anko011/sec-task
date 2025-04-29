import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskPackageDTO {
  @IsString()
  @MinLength(1)
  @IsOptional()
  @ApiProperty()
  public name?: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty()
  readonly baseDocument?: string;
}
