import { ICommand } from '@nestjs/cqrs';

export class DeleteOrganizationTypeCommand implements ICommand {
  public constructor(public readonly id: string) {}
}
