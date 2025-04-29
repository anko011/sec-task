import { IQuery } from '@nestjs/cqrs';

export class FindUserQuery implements IQuery {
  public constructor(public readonly id: string) {}
}
