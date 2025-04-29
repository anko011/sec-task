import { ICommand } from '@nestjs/cqrs';
import { TaskDangerStatus } from '../../entities';

export class CreateTaskCommand implements ICommand {
  public constructor(
    public readonly dto: {
      readonly name: string;
      readonly description: string;
      readonly packageId: string;
      readonly categoryId: string;
      readonly dangerStatus: TaskDangerStatus;
    },
  ) {}
}
