import { ICommand } from '@nestjs/cqrs';
import { CreateTaskCommand } from '../tasks/create-task.command';
import { TaskPackageStatus } from '~/tasks/application/entities';

export class CreateTaskPackageCommand implements ICommand {
  public constructor(
    public readonly dto: {
      readonly incomingRequisite: string;
      readonly outgoingRequisite: string;
      readonly status?: TaskPackageStatus;
      readonly assignedOrganizationIds: string[];
      readonly tasks: CreateTaskCommand['dto'][];
    },
  ) {}
}
