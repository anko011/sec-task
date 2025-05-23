import { ICommand } from '@nestjs/cqrs';
import { TaskDangerStatus } from '~/tasks/application/entities';

export class CreateTaskCommand implements ICommand {
  constructor(
    readonly packageId: string,
    readonly dto: {
      readonly nameId: string;
      readonly categoryId: string;
      readonly number: string;
      readonly description: string;
      readonly dangerStatus: TaskDangerStatus;
      readonly bdu: string[];
      readonly cve: string[];
      readonly additionalInformation?: string;
    },
  ) {}
}
