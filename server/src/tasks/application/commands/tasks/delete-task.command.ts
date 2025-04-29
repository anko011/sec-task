import { ICommand } from '@nestjs/cqrs';

export class DeleteTaskCommand implements ICommand {
  public constructor(
    public readonly packageId: string,
    public readonly taskId: string,
  ) {}
}
