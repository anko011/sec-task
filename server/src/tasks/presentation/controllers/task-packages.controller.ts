import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { TaskPackage } from '../../application/entities/task-package';
import { FindPaginatedTaskPackagesQuery } from '../../application/queries/task-packages/find-paginated-task-packages.query';

import { Task } from '../../application/entities';
import {
  CreateTaskDTO,
  CreateTaskPackageDTO,
  UpdateTaskDTO,
  UpdateTaskPackageDTO,
} from '../contracts';
import {
  CreateTaskPackageCommand,
  DeleteTaskPackageCommand,
  UpdateTaskPackageCommand,
} from '../../application/commands/task-packages';
import { FindTaskPackageQuery } from '../../application/queries/task-packages';
import {
  FindPaginatedTasksQuery,
  FindTaskQuery,
} from '../../application/queries/tasks';
import {
  CreateTaskCommand,
  DeleteTaskCommand,
  UpdateTaskCommand,
} from '../../application/commands/tasks';

import type { Paginated } from '../../../common/queries';
import { CheckPolicies } from '../../../ability/presentation/decorators';
import {
  CreateTaskPackagePolicy,
  CreateTaskPolicy,
  DeleteTaskPackagePolicy,
  DeleteTaskPolicy,
  ReadTaskPackagePolicy,
  ReadTaskPolicy,
  UpdateTaskPackagePolicy,
  UpdateTaskPolicy,
} from '../polices';

@ApiBearerAuth()
@Controller('task-packages')
export class TaskPackagesController {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiOperation({ summary: 'Retrieve all task packages' })
  @ApiQuery({ name: 'limit', type: Number, required: false, default: 10 })
  @ApiQuery({ name: 'offset', type: Number, required: false, default: 0 })
  @ApiResponse({ status: HttpStatus.OK, type: [TaskPackage] })
  @Get()
  @CheckPolicies(new ReadTaskPackagePolicy())
  public async findTaskPackages(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<Paginated<TaskPackage[]>> {
    return this.queryBus.execute<FindPaginatedTaskPackagesQuery>(
      new FindPaginatedTaskPackagesQuery({}, { limit, offset }),
    );
  }

  @ApiParam({ name: 'id', description: 'Id of task package' })
  @ApiOperation({ summary: 'Retrieve task package by id' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskPackage })
  @Get(':id')
  @CheckPolicies(new ReadTaskPolicy())
  public async getTaskPackage(@Param('id') id: string): Promise<TaskPackage> {
    const taskPackage: TaskPackage | null = await this.queryBus.execute(
      new FindTaskPackageQuery(id),
    );

    if (!taskPackage) throw new NotFoundException('Task does not exist');
    return taskPackage;
  }

  //TODO: it needs a realise 'where' param
  @ApiParam({ name: 'id', description: 'Id of task package' })
  @ApiOperation({ summary: 'Retrieve tasks of package' })
  @ApiQuery({ name: 'limit', type: Number, required: false, default: 10 })
  @ApiQuery({ name: 'offset', type: Number, required: false, default: 0 })
  @ApiResponse({ status: HttpStatus.OK, type: [Task] })
  @Get(':id/tasks')
  @CheckPolicies(new ReadTaskPolicy())
  public async getTasksByPackage(
    @Param('id') packageId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<Paginated<Task[]>> {
    return await this.queryBus.execute(
      new FindPaginatedTasksQuery(packageId, {}, { limit, offset }),
    );
  }

  @ApiParam({ name: 'id', description: 'Id of task package' })
  @ApiParam({ name: 'taskId', description: 'Id of task' })
  @ApiOperation({ summary: 'Retrieve task of package' })
  @ApiResponse({ status: HttpStatus.OK, type: Task })
  @Get(':id/tasks/:taskId')
  @CheckPolicies(new ReadTaskPolicy())
  public async getTaskByPackage(
    @Param('id') id: string,
    @Param('taskId') taskId: string,
  ): Promise<Task> {
    return await this.queryBus.execute(new FindTaskQuery(id, taskId));
  }

  @ApiOperation({ summary: 'Create task package' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskPackage })
  @ApiBody({ type: CreateTaskPackageDTO })
  @Post()
  @CheckPolicies(new CreateTaskPackagePolicy())
  public async createTaskPackage(
    @Body() dto: CreateTaskPackageDTO,
  ): Promise<TaskPackage> {
    return this.commandBus.execute(new CreateTaskPackageCommand(dto));
  }

  @Post(':id/tasks')
  @ApiOperation({ summary: 'Create task' })
  @ApiParam({ name: 'id', description: 'Id of task package' })
  @ApiResponse({ status: HttpStatus.OK, type: Task })
  @ApiBody({ type: CreateTaskDTO })
  @CheckPolicies(new CreateTaskPolicy())
  public async createTask(
    @Param('id') packageId: string,
    @Body() dto: CreateTaskDTO,
  ): Promise<Task> {
    return this.commandBus.execute(
      new CreateTaskCommand({ packageId, ...dto }),
    );
  }

  @ApiOperation({ summary: 'Update task package' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskPackage })
  @ApiBody({ type: UpdateTaskPackageDTO })
  @ApiParam({ name: 'id', description: 'Id of task package' })
  @Patch(':id')
  @CheckPolicies(new UpdateTaskPackagePolicy())
  public async updateTaskPackage(
    @Param('id') id: string,
    @Body() dto: UpdateTaskPackageDTO,
  ): Promise<TaskPackage> {
    return this.commandBus.execute<UpdateTaskPackageCommand>(
      new UpdateTaskPackageCommand({ id, ...dto }),
    );
  }

  @ApiOperation({ summary: 'Update task of task package' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskPackage })
  @ApiBody({ type: UpdateTaskDTO })
  @ApiParam({ name: 'id', description: 'Id of task package' })
  @ApiParam({ name: 'taskId', description: 'Id of task' })
  @Patch(':id/tasks/:taskId')
  @CheckPolicies(new UpdateTaskPolicy())
  public async updateTask(
    @Param('id') packageId: string,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskPackageDTO,
  ): Promise<TaskPackage> {
    return this.commandBus.execute<UpdateTaskCommand>(
      new UpdateTaskCommand({ ...dto, id: taskId, packageId }),
    );
  }

  @ApiOperation({ summary: 'Delete task package' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiParam({ name: 'id', description: 'Id of task package' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @CheckPolicies(new DeleteTaskPackagePolicy())
  public async deleteTaskPackage(
    @Param('id') packageId: string,
  ): Promise<TaskPackage> {
    return this.commandBus.execute<DeleteTaskPackageCommand>(
      new DeleteTaskPackageCommand(packageId),
    );
  }

  @ApiOperation({ summary: 'Delete task of task package' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiParam({ name: 'id', description: 'Id of task package' })
  @ApiParam({ name: 'taskId', description: 'Id of task' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/tasks/:taskId')
  @CheckPolicies(new DeleteTaskPolicy())
  public async deleteTask(
    @Param('id') packageId: string,
    @Param('taskId') taskId: string,
  ): Promise<TaskPackage> {
    return this.commandBus.execute<DeleteTaskCommand>(
      new DeleteTaskCommand(packageId, taskId),
    );
  }
}
