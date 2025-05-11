import { ICommand } from '@nestjs/cqrs';
import { TaskStatus } from '../../entities';

export class ChangeTaskStatusCommand implements ICommand {
  constructor(
    readonly packageId: string,
    readonly taskId: string,
    readonly dto: {
      readonly organizationId: string;
      readonly status: TaskStatus;
      readonly comment: string;
    },
  ) {}
}
