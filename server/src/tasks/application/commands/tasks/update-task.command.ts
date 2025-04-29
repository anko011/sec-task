import { ICommand } from '@nestjs/cqrs';
import { TaskCategory, TaskDangerStatus } from '../../entities';

export class UpdateTaskCommand implements ICommand {
  public constructor(
    public readonly dto: {
      readonly id: string;
      readonly packageId: string;
      readonly name?: string;
      readonly description?: string;
      readonly category?: TaskCategory;
      readonly dangerStatus?: TaskDangerStatus;
    },
  ) {}
}
