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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, Paginated } from '../../../common/queries';
import { TaskPackage, TaskPackageStatus } from '../../application/entities';
import {
  FindPaginatedTaskPackagesQuery,
  FindTaskPackageQuery,
} from '../../application/queries/task-packages';
import {
  CreateTaskPackageCommand,
  DeleteTaskPackageCommand,
  FixTaskPackageCommand,
  UpdateTaskPackageCommand,
} from '../../application/commands/task-packages';
import { CreateTaskPackageDTO, UpdateTaskPackageDTO } from '../contracts';
import { CheckPolicies } from '../../../ability/presentation/decorators';
import {
  CreateTaskPackagePolicy,
  DeleteTaskPackagePolicy,
  FixTaskPackagePolicy,
  ReadTaskPackagePolicy,
  UpdateTaskPackagePolicy,
} from '../polices';
import { ReadOrganizationPolicy } from '~/organizations/presentation/polices';
import { FindPaginatedOrganizationsQuery } from '~/tasks/application/queries/organizations';
import { Organization } from '~/organizations/applications/entities';
import { ParseBooleanPipe } from '~/common/pipes';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'node:fs';
import { UploadFilesCommand } from '~/tasks/application/commands/task-packages/upload-files.command';
import { RefreshToken } from '~/auth/presentation/decorators';

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
  @ApiQuery({ name: 'incomingRequisite', type: String, required: false })
  @ApiQuery({ name: 'outgoingRequisite', type: String, required: false })
  @ApiQuery({ name: 'scope', type: String, required: false })
  @ApiQuery({
    name: 'status',
    type: 'enum',
    enum: TaskPackageStatus,
    required: false,
  })
  @ApiPaginatedResponse(TaskPackage)
  public async findTaskPackages(
    @RefreshToken() refreshToken: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('incomingRequisite') incomingRequisite?: string,
    @Query('outgoingRequisite') outgoingRequisite?: string,
    @Query('status') status?: TaskPackageStatus,
    @Query('scope') scope?: 'organization' | 'all',
  ): Promise<Paginated<TaskPackage[]>> {
    return this.queryBus.execute<FindPaginatedTaskPackagesQuery>(
      new FindPaginatedTaskPackagesQuery(
        scope === 'organization' ? refreshToken : undefined,
        { incomingRequisite, outgoingRequisite, status },
        { limit, offset },
      ),
    );
  }

  @Get(':id')
  @CheckPolicies(new ReadTaskPackagePolicy())
  @ApiOperation({ summary: 'Retrieve  task packages' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskPackage })
  public async findTaskPackage(@Param('id') id: string): Promise<TaskPackage> {
    return this.queryBus.execute(new FindTaskPackageQuery(id));
  }

  @Get(':id/organizations')
  @CheckPolicies(new ReadOrganizationPolicy())
  @ApiOperation({ summary: 'Retrieve  organizations of task package' })
  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiQuery({ name: 'typeId', type: String, required: false })
  @ApiQuery({ name: 'archived', type: Boolean, required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [Organization] })
  public async findTaskPackageOrganizations(
    @Param('id') id: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('name') name?: string,
    @Query('typeId') typeId?: string,
    @Query('isArchived', ParseBooleanPipe) isArchived?: boolean,
  ): Promise<TaskPackage> {
    return this.queryBus.execute(
      new FindPaginatedOrganizationsQuery(
        id,
        { name, typeId, isArchived },
        { limit, offset },
      ),
    );
  }

  @Post()
  @CheckPolicies(new CreateTaskPackagePolicy())
  @ApiOperation({ summary: 'Create task package' })
  @ApiResponse({ status: HttpStatus.CREATED, type: TaskPackage })
  @ApiBody({ type: CreateTaskPackageDTO })
  public async createTaskPackage(
    @Body() dto: CreateTaskPackageDTO,
  ): Promise<TaskPackage> {
    return await this.commandBus.execute(new CreateTaskPackageCommand(dto));
  }

  @Post(':id/fix')
  @CheckPolicies(new FixTaskPackagePolicy())
  @ApiOperation({ summary: 'Fix task package' })
  @ApiResponse({ status: HttpStatus.OK })
  public async fixTaskPackage(@Param('id') id: string): Promise<TaskPackage> {
    return await this.commandBus.execute(new FixTaskPackageCommand(id));
  }

  @Post(':id/upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = `./uploads/${req.params.id}`;
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          file.originalname = Buffer.from(file.originalname, 'latin1').toString(
            'utf8',
          );
          cb(null, file.originalname);
        },
      }),
    }),
  )
  uploadAttachment(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.commandBus.execute(new UploadFilesCommand(id, files));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task package' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskPackage })
  @ApiBody({ type: CreateTaskPackageDTO })
  @CheckPolicies(new UpdateTaskPackagePolicy())
  public async updateTaskPackage(
    @Param('id') id: string,
    @Body() dto: UpdateTaskPackageDTO,
  ) {
    return await this.commandBus.execute(
      new UpdateTaskPackageCommand(id, { ...dto, tasks: dto.tasks ?? [] }),
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
