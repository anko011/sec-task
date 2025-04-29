import { IQuery } from '@nestjs/cqrs';

export class FindTaskQuery implements IQuery {
  public constructor(
    public readonly packageId: string,
    public readonly taskId: string,
  ) {}
}
