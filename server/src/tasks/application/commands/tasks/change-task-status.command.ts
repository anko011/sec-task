import { ICommand } from '@nestjs/cqrs';
import { TaskStatus } from '../../entities';

export class ChangeTaskStatusCommand implements ICommand {
  constructor(
    readonly packageId: string,
    readonly taskId: string,
    readonly organizationId: string,
    readonly dto: {
      readonly status: TaskStatus;
      readonly comment: string;
    },
  ) {}
}
