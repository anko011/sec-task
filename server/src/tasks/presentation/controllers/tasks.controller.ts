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
import {
  Task,
  TaskDangerStatus,
  TaskExecution,
} from '../../application/entities';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  FindPaginatedTasksQuery,
  FindTaskExecutionQuery,
} from '../../application/queries/tasks';
import { FindTaskPackageQuery } from '../../application/queries/task-packages';
import {
  ChangeTaskStatusDTO,
  CreateTaskDTO,
  UpdateTaskDTO,
} from '../contracts';
import {
  ChangeTaskStatusCommand,
  CreateTaskCommand,
  DeleteTaskCommand,
  UpdateTaskCommand,
} from '../../application/commands/tasks';
import { CheckPolicies } from '../../../ability/presentation/decorators';
import {
  CreateTaskPolicy,
  DeleteTaskPolicy,
  ReadTaskPolicy,
  UpdateTaskPolicy,
} from '../polices';

@ApiBearerAuth()
@Controller('task-packages/:packageId/tasks')
export class TasksController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @CheckPolicies(new ReadTaskPolicy())
  @ApiOperation({ summary: 'Retrieve all tasks of package' })
  @ApiQuery({ name: 'additionalInformation', type: String, required: false })
  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiQuery({ name: 'number', type: String, required: false })
  @ApiQuery({ name: 'description', type: String, required: false })
  @ApiQuery({
    name: 'dangerStatus',
    type: String,
    required: false,
    enum: TaskDangerStatus,
  })
  @ApiQuery({ name: 'categoryId', type: String, required: false })
  @ApiPaginatedResponse(Task)
  public async findTasks(
    @Param('packageId') packageId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('additionalInformation') additionalInformation?: string,
    @Query('nameId') nameId?: string,
    @Query('number') number?: string,
    @Query('description') description?: string,
    @Query('dangerStatus') dangerStatus?: TaskDangerStatus,
    @Query('categoryId') categoryId?: string,
  ): Promise<Paginated<Task[]>> {
    return this.queryBus.execute(
      new FindPaginatedTasksQuery(
        packageId,
        {
          additionalInformation,
          nameId,
          number,
          description,
          dangerStatus,
          categoryId,
        },
        { limit, offset },
      ),
    );
  }

  @Get(':id')
  @CheckPolicies(new ReadTaskPolicy())
  @ApiOperation({ summary: 'Retrieve task' })
  @ApiResponse({ status: HttpStatus.OK, type: Task })
  public async findTask(@Param('id') id: string): Promise<Task> {
    return this.queryBus.execute(new FindTaskPackageQuery(id));
  }

  @Get(':id/executions')
  @CheckPolicies(new ReadTaskPolicy())
  @ApiOperation({ summary: 'Retrieve task executions' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskExecution })
  public async findTaskExecutions(
    @Param('packageId') packageId: string,
    @Param('id') id: string,
    @Query('organizationId') organizationId?: string,
  ): Promise<TaskExecution> {
    return this.queryBus.execute(
      new FindTaskExecutionQuery(packageId, id, organizationId),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create task' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Task })
  @ApiBody({ type: CreateTaskDTO })
  @CheckPolicies(new CreateTaskPolicy())
  public async createTask(
    @Param('packageId') packageId: string,
    @Body() dto: CreateTaskDTO,
  ): Promise<Task> {
    return this.commandBus.execute(new CreateTaskCommand(packageId, dto));
  }

  @Post(':id/change-status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskExecution })
  @ApiBody({ type: ChangeTaskStatusDTO })
  @CheckPolicies(new UpdateTaskPolicy())
  public async updateTaskStatus(
    @Param('packageId') packageId: string,
    @Param('id') taskId: string,
    @Body() dto: ChangeTaskStatusDTO,
  ): Promise<Task> {
    return this.commandBus.execute(
      new ChangeTaskStatusCommand(packageId, taskId, dto),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: HttpStatus.OK, type: Task })
  @ApiBody({ type: UpdateTaskDTO })
  @CheckPolicies(new UpdateTaskPolicy())
  public async updateTask(
    @Param('packageId') packageId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDTO,
  ): Promise<Task> {
    return this.commandBus.execute(
      new UpdateTaskCommand(packageId, { id, ...dto }),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @CheckPolicies(new DeleteTaskPolicy())
  public async deleteTask(
    @Param('packageId') packageId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteTaskCommand(packageId, id));
  }
}
