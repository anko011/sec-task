import { IQuery } from '@nestjs/cqrs';

export class FindOrganizationTypeQuery implements IQuery {
  public constructor(public readonly id: string) {}
}
