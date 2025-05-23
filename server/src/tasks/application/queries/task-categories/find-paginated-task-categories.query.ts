import { IQuery } from '@nestjs/cqrs';
import { PaginationOptions } from '~/common/queries';

export class FindPaginatedTaskCategoriesQuery implements IQuery {
  public constructor(
    public readonly where?: {
      title?: string;
      color?: string;
    },
    public readonly options?: PaginationOptions,
  ) {}
}
