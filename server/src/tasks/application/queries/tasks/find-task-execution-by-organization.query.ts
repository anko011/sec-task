import { IQuery } from '@nestjs/cqrs';

export class FindTaskExecutionByOrganizationQuery implements IQuery {
  constructor(
    readonly packageId: string,
    readonly taskId: string,
    readonly organizationId?: string,
  ) {}
}
