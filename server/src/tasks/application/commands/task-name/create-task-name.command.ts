import { ICommand } from '@nestjs/cqrs';

export class CreateTaskNameCommand implements ICommand {
  constructor(
    readonly dto: {
      title: string;
    },
  ) {}
}
