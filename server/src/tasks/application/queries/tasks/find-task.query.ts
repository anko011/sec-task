import { IQuery } from '@nestjs/cqrs';

export class FindTaskQuery implements IQuery {
  constructor(
    readonly packageId: string,
    readonly id: string,
  ) {}
}
