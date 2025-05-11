import { ICommand } from '@nestjs/cqrs';

export class UpdateTaskNameCommand implements ICommand {
  constructor(
    readonly dto: {
      readonly id: string;
      readonly name?: string;
    },
  ) {}
}
