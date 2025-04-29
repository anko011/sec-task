import { IQuery } from '@nestjs/cqrs';

export class FindTaskPackageQuery implements IQuery {
  public constructor(public readonly id: string) {}
}
