import { IQuery } from '@nestjs/cqrs';

export class FindTaskNameQuery implements IQuery {
  public constructor(public readonly id: string) {}
}
