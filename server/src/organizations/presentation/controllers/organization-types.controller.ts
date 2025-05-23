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
import { OrganizationType } from '../../applications/entities';
import {
  CreateOrganizationTypePolicy,
  DeleteOrganizationTypePolicy,
  ReadOrganizationTypePolicy,
  UpdateOrganizationTypePolicy,
} from '../polices';
import { CheckPolicies } from '../../../ability/presentation/decorators';
import {
  FindOrganizationTypeQuery,
  FindPaginatedOrganizationTypesQuery,
} from '../../applications/queries/organization-types';
import { TaskPackage } from '../../../tasks/application/entities';
import {
  CreateOrganizationTypeCommand,
  DeleteOrganizationTypeCommand,
  UpdateOrganizationTypeCommand,
} from '../../applications/commands/organization-types';
import {
  CreateOrganizationTypeDTO,
  UpdateOrganizationTypeDTO,
} from '../contracts';

@ApiBearerAuth()
@Controller('organization-types')
export class OrganizationTypesController {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @CheckPolicies(new ReadOrganizationTypePolicy())
  @ApiOperation({ summary: 'Retrieve all organization types' })
  @ApiPaginatedResponse(OrganizationType)
  @ApiQuery({ name: 'title', type: String, required: false, default: '' })
  public async findOrganizationTypes(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('title') title?: string,
  ): Promise<Paginated<OrganizationType[]>> {
    return this.queryBus.execute<FindPaginatedOrganizationTypesQuery>(
      new FindPaginatedOrganizationTypesQuery({ title }, { limit, offset }),
    );
  }

  @Get(':id')
  @CheckPolicies(new ReadOrganizationTypePolicy())
  @ApiOperation({ summary: 'Retrieve  organization type by id' })
  @ApiResponse({ type: OrganizationType })
  public async findOrganizationType(
    @Param('id') id: string,
  ): Promise<OrganizationType> {
    return this.queryBus.execute<FindOrganizationTypeQuery>(
      new FindOrganizationTypeQuery(id),
    );
  }

  @Post()
  @CheckPolicies(new CreateOrganizationTypePolicy())
  @ApiOperation({ summary: 'Create organization type' })
  @ApiResponse({ status: HttpStatus.CREATED, type: OrganizationType })
  @ApiBody({ type: CreateOrganizationTypeDTO })
  public async createOrganizationType(
    @Body() dto: CreateOrganizationTypeDTO,
  ): Promise<TaskPackage> {
    return this.commandBus.execute(new CreateOrganizationTypeCommand(dto));
  }

  @Patch(':id')
  @CheckPolicies(new UpdateOrganizationTypePolicy())
  @ApiOperation({ summary: 'Update organization type' })
  @ApiResponse({ status: HttpStatus.OK, type: OrganizationType })
  @ApiBody({ type: UpdateOrganizationTypeDTO })
  public async updateOrganizationType(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationTypeDTO,
  ): Promise<TaskPackage> {
    return this.commandBus.execute(new UpdateOrganizationTypeCommand(id, dto));
  }

  @Delete(':id')
  @CheckPolicies(new DeleteOrganizationTypePolicy())
  @ApiOperation({ summary: 'Delete organization type' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  public async deleteOrganizationType(
    @Param('id') id: string,
  ): Promise<TaskPackage> {
    return this.commandBus.execute(new DeleteOrganizationTypeCommand(id));
  }
}
