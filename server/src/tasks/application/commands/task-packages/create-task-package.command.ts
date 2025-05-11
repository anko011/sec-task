import { ICommand } from '@nestjs/cqrs';

export class CreateTaskPackageCommand implements ICommand {
  public constructor(
    public readonly dto: {
      readonly incomingRequisite: string;
      readonly outgoingRequisite: string;
      readonly assignedOrganizationIds: string[];
    },
  ) {}
}
