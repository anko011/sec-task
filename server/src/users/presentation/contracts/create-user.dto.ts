import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '../../application/entities';
import { IsExistingId } from '~/common/validators';
import { Organization } from '~/organizations/applications/entities';

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Обязательное поле' })
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Обязательное поле' })
  readonly secondName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Обязательное поле' })
  readonly patronymic: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Обязательное поле' })
  readonly email: string;

  @ApiProperty()
  @IsEnum(Role, { message: 'Обязательное поле' })
  readonly role: Role;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsExistingId(Organization)
  @IsOptional()
  readonly organizationId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Обязательное поле' })
  readonly password: string;
}
