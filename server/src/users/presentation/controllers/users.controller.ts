import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';

import { TaskPackage } from '../../../tasks/application/entities';
import { User } from '../../application/entities';

import type { Paginated } from '../../../common/queries';
import { FindPaginatedUsersQuery } from '../../application/queries/users';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  public constructor(private readonly queryBus: QueryBus) {}

  //TODO: Add query parsing for 'where' conditions
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiQuery({ name: 'limit', type: Number, required: false, default: 10 })
  @ApiQuery({ name: 'offset', type: Number, required: false, default: 0 })
  @ApiResponse({ status: HttpStatus.OK, type: [User] })
  @Get()
  public async findUsers(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<Paginated<TaskPackage[]>> {
    return this.queryBus.execute<FindPaginatedUsersQuery>(
      new FindPaginatedUsersQuery({}, { limit, offset }),
    );
  }
}
