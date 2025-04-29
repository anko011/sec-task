import { IQuery } from '@nestjs/cqrs';
import { TaskCategory, TaskDangerStatus } from '../../entities';

export class FindPaginatedTaskPackagesQuery implements IQuery {
  public constructor(
    public readonly where?: {
      description?: string;
      name?: string;
      category?: TaskCategory;
      dangerStatus?: TaskDangerStatus;
      packageId?: string;
    },
    public readonly options?: {
      readonly limit?: number;
      readonly offset?: number;
    },
  ) {}
}
