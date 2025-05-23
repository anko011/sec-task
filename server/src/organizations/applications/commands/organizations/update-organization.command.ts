import { ICommand } from '@nestjs/cqrs';

export class UpdateOrganizationCommand implements ICommand {
  constructor(
    readonly id: string,
    readonly dto: {
      readonly name?: string;
      readonly typeId?: string;
      readonly isArchived?: boolean;
    },
  ) {}
}
