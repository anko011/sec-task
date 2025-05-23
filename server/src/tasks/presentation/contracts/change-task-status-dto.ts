import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from '../../application/entities';

export class ChangeTaskStatusDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Обязательное поле' })
  @IsString()
  readonly comment: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Обязательное поле' })
  @IsEnum(TaskStatus)
  readonly status: TaskStatus;
}
