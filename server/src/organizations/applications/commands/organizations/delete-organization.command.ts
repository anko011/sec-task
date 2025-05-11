import { ICommand } from '@nestjs/cqrs';

export class DeleteOrganizationCommand implements ICommand {
  public constructor(public readonly id: string) {}
}
