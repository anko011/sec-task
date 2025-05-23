import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { TaskPackage } from '../../entities/task-package';
import { Paginated, prepareSearchConditions } from '../../../../common/queries';

import { FindPaginatedTaskPackagesQuery } from './find-paginated-task-packages.query';
import { EntityRepository } from '@mikro-orm/better-sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '~/users/application/entities';
import { UnauthorizedException } from '@nestjs/common';

@QueryHandler(FindPaginatedTaskPackagesQuery)
export class FindPaginatedTaskPackagesQueryHandler
  implements IQueryHandler<FindPaginatedTaskPackagesQuery>
{
  constructor(
    @InjectRepository(TaskPackage)
    private readonly taskPackagesRepository: EntityRepository<TaskPackage>,
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute({
    refreshToken,
    where,
    options,
  }: FindPaginatedTaskPackagesQuery): Promise<
    Paginated<Partial<TaskPackage>[]>
  > {
    const decoded = this.jwtService.decode<{ sub: string } | null>(
      refreshToken ?? '',
    );

    let conditions = prepareSearchConditions({ ...where });

    if (decoded) {
      const user = await this.usersRepository.findOne(decoded.sub, {
        populate: ['organization'],
      });
      if (!user) throw new UnauthorizedException();

      conditions = Object.assign(conditions, {
        organizations: user.organization,
      });
    }

    const [items, total] = await this.taskPackagesRepository.findAndCount(
      conditions,
      {
        ...options,
        populate: [
          'tasks.id',
          'tasks.deadline',
          'organizations:ref',
          'attachments.id',
        ],
      },
    );

    return {
      items,
      total,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    };
  }
}
