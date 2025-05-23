import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ApiPaginatedResponse, Paginated } from '../../../common/queries';
import { Role, User } from '../../application/entities';

import {
  FindPaginatedUsersQuery,
  FindUserQuery,
} from '../../application/queries/users';
import { CheckPolicies } from '../../../ability/presentation/decorators';
import {
  CreateUserCommand,
  DeleteUserCommand,
  UpdateUserCommand,
} from '../../application/commands/users';

import {
  CreateUserPolice,
  DeleteUserPolice,
  ReadUserPolice,
  UpdateUserPolice,
} from '../polices';
import { CreateUserDTO, UpdateUserDTO } from '../contracts';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @CheckPolicies(new ReadUserPolice())
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiQuery({ name: 'firstName', type: String, required: false })
  @ApiQuery({ name: 'secondName', type: String, required: false })
  @ApiQuery({ name: 'patronymic', type: String, required: false })
  @ApiQuery({ name: 'email', type: String, required: false })
  @ApiQuery({ name: 'role', type: String, required: false })
  @ApiPaginatedResponse(User)
  public async findUsers(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('firstName') firstName?: string,
    @Query('secondName') secondName?: string,
    @Query('patronymic') patronymic?: string,
    @Query('email') email?: string,
    @Query('role') role?: Role,
  ): Promise<Paginated<User[]>> {
    return this.queryBus.execute<FindPaginatedUsersQuery>(
      new FindPaginatedUsersQuery(
        { firstName, secondName, patronymic, email, role },
        { limit, offset },
      ),
    );
  }

  @Get(':id')
  @CheckPolicies(new ReadUserPolice())
  @ApiOperation({ summary: 'Retrieve  user by id' })
  @ApiResponse({ type: User })
  @ApiBody({ type: CreateUserDTO })
  public async findUser(@Param('id') id: string): Promise<User> {
    return this.queryBus.execute<FindUserQuery>(new FindUserQuery(id));
  }

  @Post()
  @CheckPolicies(new CreateUserPolice())
  @ApiOperation({ summary: 'Create  user id' })
  public async createUser(@Body() dto: CreateUserDTO) {
    return this.commandBus.execute(new CreateUserCommand(dto));
  }

  @Patch(':id')
  @CheckPolicies(new UpdateUserPolice())
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @ApiBody({ type: UpdateUserDTO })
  public async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDTO,
  ): Promise<User> {
    return this.commandBus.execute(new UpdateUserCommand(id, dto));
  }

  @Delete(':id')
  @CheckPolicies(new DeleteUserPolice())
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  public async deleteUser(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }
}
