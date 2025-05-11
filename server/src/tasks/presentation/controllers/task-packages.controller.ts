import { CommandBus, QueryBus } from '@nestjs/cqrs';
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
  ApiResponse,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, Paginated } from '../../../common/queries';
import { TaskPackage } from '../../application/entities';
import {
  FindPaginatedTaskPackagesQuery,
  FindTaskPackageQuery,
} from '../../application/queries/task-packages';
import {
  CreateTaskPackageCommand,
  DeleteTaskPackageCommand,
  UpdateTaskPackageCommand,
} from '../../application/commands/task-packages';
import { CreateTaskPackageDTO, UpdateTaskPackageDTO } from '../contracts';
import { CheckPolicies } from '../../../ability/presentation/decorators';
import {
  CreateTaskPackagePolicy,
  DeleteTaskPackagePolicy,
  ReadTaskPackagePolicy,
  UpdateTaskPackagePolicy,
} from '../polices';

@ApiBearerAuth()
@Controller('task-packages')
export class TaskPackagesController {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @CheckPolicies(new ReadTaskPackagePolicy())
  @ApiOperation({ summary: 'Retrieve all task packages' })
  @ApiPaginatedResponse(TaskPackage)
  public async findTaskPackages(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<Paginated<TaskPackage[]>> {
    return this.queryBus.execute<FindPaginatedTaskPackagesQuery>(
      new FindPaginatedTaskPackagesQuery({}, { limit, offset }),
    );
  }

  @Get(':id')
  @CheckPolicies(new ReadTaskPackagePolicy())
  @ApiOperation({ summary: 'Retrieve  task packages' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskPackage })
  public async findTaskPackage(@Param('id') id: string): Promise<TaskPackage> {
    return this.queryBus.execute(new FindTaskPackageQuery(id));
  }

  @Post()
  @CheckPolicies(new CreateTaskPackagePolicy())
  @ApiOperation({ summary: 'Create task package' })
  @ApiResponse({ status: HttpStatus.CREATED, type: TaskPackage })
  @ApiBody({ type: CreateTaskPackageDTO })
  public async createTaskPackage(
    @Body() dto: CreateTaskPackageDTO,
  ): Promise<TaskPackage> {
    return this.commandBus.execute(new CreateTaskPackageCommand(dto));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task package' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskPackage })
  @ApiBody({ type: CreateTaskPackageDTO })
  @CheckPolicies(new UpdateTaskPackagePolicy())
  public async updateTaskPackage(
    @Param('id') id: string,
    @Body() dto: UpdateTaskPackageDTO,
  ): Promise<TaskPackage> {
    return this.commandBus.execute(
      new UpdateTaskPackageCommand({ id, ...dto }),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task package' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @CheckPolicies(new DeleteTaskPackagePolicy())
  public async deleteTaskPackage(
    @Param('id') id: string,
  ): Promise<TaskPackage> {
    return this.commandBus.execute(new DeleteTaskPackageCommand(id));
  }
}
