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
  FindTaskExecutionByOrganizationQuery,
  FindTaskExecutionHistoriesQuery,
  FindTaskExecutionsQuery,
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
  @ApiQuery({ name: 'nameId', type: String, required: false })
  @ApiQuery({ name: 'number', type: String, required: false })
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
    @Query('nameId') nameId?: string,
    @Query('number') number?: string,
    @Query('dangerStatus') dangerStatus?: TaskDangerStatus,
    @Query('categoryId') categoryId?: string,
  ): Promise<Paginated<Task[]>> {
    return this.queryBus.execute(
      new FindPaginatedTasksQuery(
        packageId,
        {
          nameId,
          number,
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

  @Get(':id/organizations/:organizationId/execution')
  @CheckPolicies(new ReadTaskPolicy())
  @ApiOperation({ summary: 'Retrieve task executions' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskExecution })
  public async findTaskExecutionsByOrganizations(
    @Param('packageId') packageId: string,
    @Param('id') id: string,
    @Param('organizationId') organizationId?: string,
  ): Promise<TaskExecution> {
    return this.queryBus.execute(
      new FindTaskExecutionByOrganizationQuery(packageId, id, organizationId),
    );
  }

  @Get(':id/organizations/:organizationId/execution-histories')
  @CheckPolicies(new ReadTaskPolicy())
  @ApiOperation({ summary: 'Retrieve task executions' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskExecution })
  public async findExecutionsHistories(
    @Param('packageId') packageId: string,
    @Param('id') id: string,
    @Param('organizationId') organizationId: string,
  ): Promise<TaskExecution> {
    return this.queryBus.execute(
      new FindTaskExecutionHistoriesQuery(packageId, id, organizationId),
    );
  }

  @Get(':id/executions')
  @CheckPolicies(new ReadTaskPolicy())
  @ApiOperation({ summary: 'Retrieve task executions' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskExecution })
  public async findTaskExecutions(
    @Param('packageId') packageId: string,
    @Param('id') id: string,
  ): Promise<TaskExecution> {
    return this.queryBus.execute(new FindTaskExecutionsQuery(packageId, id));
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

  @Post(':id/organization/:organizationId/change-status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskExecution })
  @ApiBody({ type: ChangeTaskStatusDTO })
  @CheckPolicies(new UpdateTaskPolicy())
  public async updateTaskStatus(
    @Param('packageId') packageId: string,
    @Param('id') taskId: string,
    @Param('organizationId') organizationId: string,
    @Body() dto: ChangeTaskStatusDTO,
  ): Promise<Task> {
    return this.commandBus.execute(
      new ChangeTaskStatusCommand(packageId, taskId, organizationId, dto),
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
    return this.commandBus.execute(new UpdateTaskCommand(packageId, id, dto));
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
