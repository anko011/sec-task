import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Paginated } from '../../../../common/queries';

import {
  OrganizationFilterCriteria,
  OrganizationsPort,
  OrganizationTypesPort,
} from '../../ports';
import { Organization } from '../../entities';

import { FindPaginatedOrganizationsQuery } from './find-paginated-organizations.query';
import { BadRequestException } from '@nestjs/common';

@QueryHandler(FindPaginatedOrganizationsQuery)
export class FindPaginatedOrganizationsQueryHandler
  implements IQueryHandler<FindPaginatedOrganizationsQuery>
{
  public constructor(
    private readonly organizationsPort: OrganizationsPort,
    private readonly organizationTypesPort: OrganizationTypesPort,
  ) {}

  public async execute({
    where,
    options,
  }: FindPaginatedOrganizationsQuery): Promise<Paginated<Organization[]>> {
    const opt: OrganizationFilterCriteria = { ...where };

    if (where?.typeId) {
      const types = await this.organizationTypesPort.find({ id: where.typeId });
      if (types.length !== 1)
        throw new BadRequestException(
          `Organization type with id ${where.typeId} not found.`,
        );

      opt.type = types[0];
    }

    const [items, total] = await Promise.all([
      this.organizationsPort.find(opt, options),
      this.organizationsPort.count(),
    ]);

    return {
      items,
      total,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    };
  }
}
