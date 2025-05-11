import { ICommand } from '@nestjs/cqrs';

export class CreateOrganizationTypeCommand implements ICommand {
  public constructor(
    public readonly dto: {
      readonly name: string;
    },
  ) {}
}
