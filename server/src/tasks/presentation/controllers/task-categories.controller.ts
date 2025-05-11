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
import { TaskCategory } from '../../application/entities';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTaskCategoryDTO, UpdateTaskCategoryDTO } from '../contracts';
import { CheckPolicies } from '../../../ability/presentation/decorators';
import {
  CreateTaskPolicy,
  DeleteTaskPolicy,
  ReadTaskPolicy,
  UpdateTaskPolicy,
} from '../polices';
import {
  FindPaginatedTaskCategoriesQuery,
  FindTaskCategoryQuery,
} from '../../application/queries/task-categories';
import {
  CreateTaskCategoryCommand,
  DeleteTaskCategoryCommand,
  UpdateTaskCategoryCommand,
} from '../../application/commands/task-categories';

@ApiBearerAuth()
@Controller('task-categories')
export class TaskCategoriesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @CheckPolicies(new ReadTaskPolicy())
  @ApiOperation({ summary: 'Retrieve all tasks categories' })
  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiQuery({ name: 'color', type: String, required: false })
  @ApiPaginatedResponse(TaskCategory)
  public async findTaskCategories(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('name') name?: string,
    @Query('color') color?: string,
  ): Promise<Paginated<TaskCategory[]>> {
    return this.queryBus.execute(
      new FindPaginatedTaskCategoriesQuery({ name, color }, { limit, offset }),
    );
  }

  @Get(':id')
  @CheckPolicies(new ReadTaskPolicy())
  @ApiOperation({ summary: 'Retrieve task category' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskCategory })
  public async findTaskCategory(
    @Param('id') id: string,
  ): Promise<TaskCategory> {
    return this.queryBus.execute(new FindTaskCategoryQuery(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create task category' })
  @ApiResponse({ status: HttpStatus.CREATED, type: TaskCategory })
  @ApiBody({ type: CreateTaskCategoryDTO })
  @CheckPolicies(new CreateTaskPolicy())
  public async createTaskCategory(
    @Body() dto: CreateTaskCategoryDTO,
  ): Promise<TaskCategory> {
    return this.commandBus.execute(new CreateTaskCategoryCommand(dto));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task category' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskCategory })
  @ApiBody({ type: UpdateTaskCategoryDTO })
  @CheckPolicies(new UpdateTaskPolicy())
  public async updateTaskCategory(
    @Param('id') id: string,
    @Body() dto: UpdateTaskCategoryDTO,
  ): Promise<TaskCategory> {
    return this.commandBus.execute(
      new UpdateTaskCategoryCommand({ id, ...dto }),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task category' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @CheckPolicies(new DeleteTaskPolicy())
  public async deleteTaskCategory(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteTaskCategoryCommand(id));
  }
}
