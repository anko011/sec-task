import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskNameDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Обязательное поле' })
  readonly name: string;
}
