import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsExistingId } from '~/common/validators';
import { Organization } from '~/organizations/applications/entities';

export class SignUpDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly secondName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly patronymic: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsExistingId(Organization)
  @IsOptional()
  public readonly organizationId: string;
}
