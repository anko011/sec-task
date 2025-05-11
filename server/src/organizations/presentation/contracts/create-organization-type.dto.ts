import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationTypeDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Обязательное поле' })
  public readonly name: string;
}
