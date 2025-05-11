import { ICommand } from '@nestjs/cqrs';

export class DeleteTaskCommand implements ICommand {
  constructor(
    readonly packageId: string,
    readonly id: string,
  ) {}
}
