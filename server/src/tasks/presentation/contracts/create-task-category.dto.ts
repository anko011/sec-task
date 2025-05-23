import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskCategoryDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Обязательное поле' })
  readonly title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Обязательное поле' })
  readonly color: string;
}
