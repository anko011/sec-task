import { ICommand } from '@nestjs/cqrs';

export class DeleteTaskPackageCommand implements ICommand {
  public constructor(public readonly id: string) {}
}
