import { ICommand } from '@nestjs/cqrs';

export class UpdateTaskNameCommand implements ICommand {
  constructor(
    readonly id: string,
    readonly dto: {
      readonly title?: string;
    },
  ) {}
}
