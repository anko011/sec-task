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
import { ApiPaginatedResponse, Paginated } from '../../../common/queries';
import { TaskName } from '../../application/entities';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTaskNameDTO, UpdateTaskNameDTO } from '../contracts';
import { CheckPolicies } from '../../../ability/presentation/decorators';
import {
  CreateTaskPolicy,
  DeleteTaskPolicy,
  ReadTaskPolicy,
  UpdateTaskPolicy,
} from '../polices';
import {
  FindPaginatedTaskNamesQuery,
  FindTaskNameQuery,
} from '../../application/queries/task-names';
import {
  CreateTaskNameCommand,
  DeleteTaskNameCommand,
  UpdateTaskNameCommand,
} from '../../application/commands/task-name';

@ApiBearerAuth()
@Controller('task-names')
export class TaskNamesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @CheckPolicies(new ReadTaskPolicy())
  @ApiOperation({ summary: 'Retrieve all tasks names' })
  @ApiQuery({ name: 'title', type: String, required: false })
  @ApiPaginatedResponse(TaskName)
  public async findTaskNames(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('title') title?: string,
  ): Promise<Paginated<TaskName[]>> {
    return this.queryBus.execute(
      new FindPaginatedTaskNamesQuery({ title }, { limit, offset }),
    );
  }

  @Get(':id')
  @CheckPolicies(new ReadTaskPolicy())
  @ApiOperation({ summary: 'Retrieve task name' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskName })
  public async findTaskName(@Param('id') id: string): Promise<TaskName> {
    return this.queryBus.execute(new FindTaskNameQuery(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create task name' })
  @ApiResponse({ status: HttpStatus.CREATED, type: TaskName })
  @ApiBody({ type: CreateTaskNameDTO })
  @CheckPolicies(new CreateTaskPolicy())
  public async createTaskName(
    @Body() dto: CreateTaskNameDTO,
  ): Promise<TaskName> {
    return this.commandBus.execute(new CreateTaskNameCommand(dto));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task name' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskName })
  @ApiBody({ type: UpdateTaskNameDTO })
  @CheckPolicies(new UpdateTaskPolicy())
  public async updateTaskName(
    @Param('id') id: string,
    @Body() dto: UpdateTaskNameDTO,
  ): Promise<TaskName> {
    return this.commandBus.execute(new UpdateTaskNameCommand(id, dto));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task name' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @CheckPolicies(new DeleteTaskPolicy())
  public async deleteTaskName(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteTaskNameCommand(id));
  }
}
