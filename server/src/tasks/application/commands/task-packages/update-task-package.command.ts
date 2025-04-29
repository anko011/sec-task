import { ICommand } from '@nestjs/cqrs';

export class UpdateTaskPackageCommand implements ICommand {
  public constructor(
    public readonly dto: {
      readonly id: string;
      readonly name?: string;
      readonly baseDocument?: string;
    },
  ) {}
}
