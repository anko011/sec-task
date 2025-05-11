import { ICommand } from '@nestjs/cqrs';

export class CreateOrganizationCommand implements ICommand {
  public constructor(
    public readonly dto: {
      readonly name: string;
      readonly typeId: string;
      readonly isArchived?: boolean;
    },
  ) {}
}
