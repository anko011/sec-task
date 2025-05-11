import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskNameDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly name?: string;
}
