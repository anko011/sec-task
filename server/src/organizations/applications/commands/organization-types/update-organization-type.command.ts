import { ICommand } from '@nestjs/cqrs';

export class UpdateOrganizationTypeCommand implements ICommand {
  public constructor(
    public readonly dto: {
      readonly id: string;
      readonly name?: string;
    },
  ) {}
}
