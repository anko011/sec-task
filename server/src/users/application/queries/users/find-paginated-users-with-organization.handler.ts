import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Paginated } from '../../../../common/queries';
import { UsersPort } from '../../ports';
import { UserWithOrganization } from './dtos/user-with-organization.dto';
import { OrganizationsPort } from '../../../../organizations/applications/ports';
import { InternalServerErrorException } from '@nestjs/common';
import { FindPaginatedUsersWithOrganizationQuery } from './find-paginated-users-with-organization.query';

@QueryHandler(FindPaginatedUsersWithOrganizationQuery)
export class FindPaginatedUsersWithOrganizationQueryHandler
  implements IQueryHandler<FindPaginatedUsersWithOrganizationQuery>
{
  public constructor(
    private readonly usersPort: UsersPort,
    private readonly organizationsPort: OrganizationsPort,
  ) {}

  public async execute({
    where,
    options,
  }: FindPaginatedUsersWithOrganizationQuery): Promise<
    Paginated<UserWithOrganization[]>
  > {
    const [items, total] = await Promise.all([
      this.usersPort.find(where, options),
      this.usersPort.count(where),
    ]);

    const organizationIds = items.map(({ organizationId }) => organizationId);
    const organizations = await this.organizationsPort.find({
      id: { $in: organizationIds },
    });

    const usersWithOrganizations = items
      .map((user) => {
        const organization = organizations.find(
          ({ id }) => id === user.organizationId,
        );

        if (!organization)
          throw new InternalServerErrorException(
            'Property organizationId of user not collisions with organization',
          );

        return new UserWithOrganization(user, organization);
      })
      .filter((user) => {
        if (!where?.organizationName) return true;
        return user.organization.name
          .toLowerCase()
          .trim()
          .includes(where.organizationName.toLowerCase().trim());
      });

    return {
      items: usersWithOrganizations,
      total,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    };
  }
}
