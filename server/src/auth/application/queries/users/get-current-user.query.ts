import { IQuery } from '@nestjs/cqrs';

export class GetCurrentUserQuery implements IQuery {
  constructor(public refreshToken: string) {}
}
