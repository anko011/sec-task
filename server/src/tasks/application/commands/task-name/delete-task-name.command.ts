import { ICommand } from '@nestjs/cqrs';

export class DeleteTaskNameCommand implements ICommand {
  constructor(readonly id: string) {}
}
