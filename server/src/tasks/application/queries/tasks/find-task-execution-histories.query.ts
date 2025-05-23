import { IQuery } from '@nestjs/cqrs';

export class FindTaskExecutionHistoriesQuery implements IQuery {
  constructor(
    readonly packageId: string,
    readonly taskId: string,
    readonly organizationId: string,
  ) {}
}
