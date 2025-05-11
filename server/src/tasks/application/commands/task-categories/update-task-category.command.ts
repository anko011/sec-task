import { ICommand } from '@nestjs/cqrs';

export class UpdateTaskCategoryCommand implements ICommand {
  constructor(
    readonly dto: {
      readonly id: string;
      readonly name?: string;
      readonly color?: string;
    },
  ) {}
}
