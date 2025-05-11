import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '../../../entities';
import { Organization } from '../../../../../organizations/applications/entities';

export class UserWithOrganization {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  secondName: string;

  @ApiProperty()
  patronymic: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  organization: Organization;

  constructor(user: User, organization: Organization) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.secondName = user.secondName;
    this.patronymic = user.patronymic;
    this.email = user.email;
    this.role = user.role;
    this.organization = organization;
  }
}
