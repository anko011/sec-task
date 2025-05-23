import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskCategoryDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly title?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly color?: string;
}
