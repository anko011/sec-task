import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/better-sqlite';

import { Organization } from '~/organizations/applications/entities';
import { Paginated, prepareSearchConditions } from '~/common/queries';

import { TaskPackage } from '../../entities';

import { FindPaginatedOrganizationsQuery } from './find-paginated-organizations.query';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(FindPaginatedOrganizationsQuery)
export class FindPaginatedOrganizationsQueryHandler
  implements IQueryHandler<FindPaginatedOrganizationsQuery>
{
  public constructor(
    @InjectRepository(TaskPackage)
    private readonly taskPackagesRepository: EntityRepository<TaskPackage>,
  ) {}

  public async execute({
    packageId,
    where,
    options,
  }: FindPaginatedOrganizationsQuery): Promise<Paginated<Organization[]>> {
    const taskPackage = await this.taskPackagesRepository.findOne(
      {
        id: packageId,
      },
      { populate: ['organizations.type'] },
    );

    if (!taskPackage)
      throw new NotFoundException(
        `Task package with id ${packageId} not found`,
      );

    const conditions = prepareSearchConditions({
      ...where,
      typeId: null,
      type: where?.typeId,
    });

    const items = await taskPackage.organizations.matching({
      where: conditions,
      ...options,
    });

    return {
      items,
      total: await taskPackage.organizations.loadCount({ where: conditions }),
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    };
  }
}
