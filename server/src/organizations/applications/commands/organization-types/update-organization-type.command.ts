import { ICommand } from '@nestjs/cqrs';

export class UpdateOrganizationTypeCommand implements ICommand {
  constructor(
    readonly id: string,
    readonly dto: {
      readonly title?: string;
    },
  ) {}
}
