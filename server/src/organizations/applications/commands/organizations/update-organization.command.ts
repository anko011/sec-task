import { ICommand } from '@nestjs/cqrs';

export class UpdateOrganizationCommand implements ICommand {
  public constructor(
    public readonly dto: {
      readonly id: string;
      readonly name?: string;
      readonly typeId?: string;
      readonly isArchived?: boolean;
    },
  ) {}
}
