import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOrganizationDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Обязательное поле' })
  public readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Обязательное поле' })
  public readonly typeId: string;

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => value === 'on')
  @IsOptional()
  public readonly isArchived?: boolean;
}
