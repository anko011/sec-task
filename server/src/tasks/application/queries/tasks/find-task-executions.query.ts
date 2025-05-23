import { IQuery } from '@nestjs/cqrs';

export class FindTaskExecutionsQuery implements IQuery {
  constructor(
    readonly packageId: string,
    readonly taskId: string,
  ) {}
}
