import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOrganizationTypeQuery } from './find-organization-type.query';
import { NotFoundException } from '@nestjs/common';
import { OrganizationTypesPort } from '../../ports';
import { OrganizationType } from '../../entities';

@QueryHandler(FindOrganizationTypeQuery)
export class FindOrganizationTypeQueryHandler
  implements IQueryHandler<FindOrganizationTypeQuery>
{
  public constructor(
    private readonly organizationTypesPort: OrganizationTypesPort,
  ) {}

  public async execute({
    id,
  }: FindOrganizationTypeQuery): Promise<OrganizationType> {
    const matchedTypes = await this.organizationTypesPort.find({ id });
    if (!matchedTypes || matchedTypes.length !== 1)
      throw new NotFoundException(`Organization type ${id} not found`);

    return matchedTypes[0];
  }
}
