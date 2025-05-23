import { ICommand } from '@nestjs/cqrs';
import { TaskPackageStatus } from '../../entities/task-package';
import {
  CreateTaskCommand,
  UpdateTaskCommand,
} from '~/tasks/application/commands/tasks';

export class UpdateTaskPackageCommand implements ICommand {
  constructor(
    readonly packageId: string,
    readonly dto: {
      readonly incomingRequisite?: string;
      readonly outgoingRequisite?: string;
      readonly status?: TaskPackageStatus;
      readonly assignedOrganizationIds?: string[];
      readonly attachmentIds?: string[];
      readonly tasks: (
        | CreateTaskCommand['dto']
        | (UpdateTaskCommand['dto'] & { id: string })
      )[];
    },
  ) {}
}
