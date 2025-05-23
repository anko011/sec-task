import { Controller, Get, Query } from '@nestjs/common';
import { CheckPolicies } from '../../../ability/presentation/decorators';
import { ReadUserPolice } from '../polices';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ApiPaginatedResponse, Paginated } from '../../../common/queries';
import { Role } from '../../application/entities';
import {
  FindPaginatedUsersWithOrganizationQuery,
  UserWithOrganization,
} from '../../application/queries/users';
import { QueryBus } from '@nestjs/cqrs';

@Controller('users-with-organization')
export class UsersWithOrganizationController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @CheckPolicies(new ReadUserPolice())
  @ApiOperation({ summary: 'Retrieve all users with organization' })
  @ApiQuery({ name: 'firstName', type: String, required: false })
  @ApiQuery({ name: 'secondName', type: String, required: false })
  @ApiQuery({ name: 'patronymic', type: String, required: false })
  @ApiQuery({ name: 'email', type: String, required: false })
  @ApiQuery({ name: 'role', type: String, required: false })
  @ApiQuery({ name: 'organizationName', type: String, required: false })
  @ApiPaginatedResponse(UserWithOrganization)
  public async findUsers(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('firstName') firstName?: string,
    @Query('secondName') secondName?: string,
    @Query('patronymic') patronymic?: string,
    @Query('email') email?: string,
    @Query('role') role?: Role,
    @Query('organizationName') organizationName?: string,
  ): Promise<Paginated<UserWithOrganization[]>> {
    return this.queryBus.execute(
      new FindPaginatedUsersWithOrganizationQuery(
        { firstName, secondName, patronymic, email, role, organizationName },
        { limit, offset },
      ),
    );
  }
}
