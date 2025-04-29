import { IsString, IsUrl, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskPackageDTO {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  public name: string;

  @IsString()
  @MinLength(1)
  @IsUrl()
  @ApiProperty()
  public baseDocument: string;
}
