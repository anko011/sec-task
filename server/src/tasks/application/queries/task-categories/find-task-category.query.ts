import { IQuery } from '@nestjs/cqrs';

export class FindTaskCategoryQuery implements IQuery {
  public constructor(public readonly id: string) {}
}
