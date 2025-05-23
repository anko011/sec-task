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
import { Organization } from '../../applications/entities';
import {
  CreateOrganizationPolicy,
  DeleteOrganizationPolicy,
  ReadOrganizationPolicy,
  UpdateOrganizationPolicy,
} from '../polices';
import { CheckPolicies } from '../../../ability/presentation/decorators';
import { CreateOrganizationDTO, UpdateOrganizationDTO } from '../contracts';
import {
  FindOrganizationQuery,
  FindPaginatedOrganizationsQuery,
} from '../../applications/queries/organizations';
import {
  CreateOrganizationCommand,
  DeleteOrganizationCommand,
  UpdateOrganizationCommand,
} from '../../applications/commands/organizations';
import { ParseBooleanPipe } from '~/common/pipes';

@ApiBearerAuth()
@Controller('organizations')
export class OrganizationsController {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @CheckPolicies(new ReadOrganizationPolicy())
  @ApiOperation({ summary: 'Retrieve all organizations' })
  @ApiPaginatedResponse(Organization)
  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiQuery({ name: 'typeId', type: String, required: false })
  @ApiQuery({ name: 'archived', type: Boolean, required: false })
  public async findOrganizations(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('name') name?: string,
    @Query('typeId') typeId?: string,
    @Query('isArchived', ParseBooleanPipe) isArchived?: boolean,
  ): Promise<Paginated<Organization[]>> {
    return this.queryBus.execute<FindPaginatedOrganizationsQuery>(
      new FindPaginatedOrganizationsQuery(
        { typeId, isArchived, name },
        { limit, offset },
      ),
    );
  }

  @Get('ids')
  public async findAllIds() {
    const organizations: Paginated<Organization[]> =
      await this.queryBus.execute<FindPaginatedOrganizationsQuery>(
        new FindPaginatedOrganizationsQuery({}, { limit: 100000, offset: 0 }),
      );

    return { ids: organizations.items.map(({ id }) => id) };
  }

  @Get(':id')
  @CheckPolicies(new ReadOrganizationPolicy())
  @ApiOperation({ summary: 'Retrieve  organization by id' })
  @ApiResponse({ type: Organization })
  public async findOrganization(
    @Param('id') id: string,
  ): Promise<Organization> {
    return this.queryBus.execute<FindOrganizationQuery>(
      new FindOrganizationQuery(id),
    );
  }

  @Post()
  @CheckPolicies(new CreateOrganizationPolicy())
  @ApiOperation({ summary: 'Create organization' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Organization })
  @ApiBody({ type: CreateOrganizationDTO })
  public async createOrganization(
    @Body() dto: CreateOrganizationDTO,
  ): Promise<Organization> {
    return this.commandBus.execute(new CreateOrganizationCommand(dto));
  }

  @Patch(':id')
  @CheckPolicies(new UpdateOrganizationPolicy())
  @ApiOperation({ summary: 'Update organization' })
  @ApiResponse({ status: HttpStatus.OK, type: Organization })
  @ApiBody({ type: UpdateOrganizationDTO })
  public async updateOrganization(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDTO,
  ): Promise<Organization> {
    return this.commandBus.execute(new UpdateOrganizationCommand(id, dto));
  }

  @Delete(':id')
  @CheckPolicies(new DeleteOrganizationPolicy())
  @ApiOperation({ summary: 'Delete organization' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  public async deleteOrganization(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteOrganizationCommand(id));
  }
}
