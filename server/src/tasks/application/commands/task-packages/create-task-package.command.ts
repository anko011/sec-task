import { ICommand } from '@nestjs/cqrs';

export class CreateTaskPackageCommand implements ICommand {
  public constructor(
    public readonly dto: {
      readonly name: string;
      readonly baseDocument: string;
    },
  ) {}
}
