import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { OrganizationsPort } from '../../ports';
import { Organization } from '../../entities';

import { FindOrganizationQuery } from './find-organization.query';

@QueryHandler(FindOrganizationQuery)
export class FindOrganizationQueryHandler
  implements IQueryHandler<FindOrganizationQuery>
{
  public constructor(private readonly organizationsPort: OrganizationsPort) {}

  public async execute({ id }: FindOrganizationQuery): Promise<Organization> {
    const matchedOrganizations = await this.organizationsPort.find({ id });

    if (matchedOrganizations.length !== 1)
      throw new NotFoundException(`Organization  ${id} not found`);

    return matchedOrganizations[0];
  }
}
