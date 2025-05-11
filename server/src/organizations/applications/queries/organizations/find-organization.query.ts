import { IQuery } from '@nestjs/cqrs';

export class FindOrganizationQuery implements IQuery {
  public constructor(public readonly id: string) {}
}
