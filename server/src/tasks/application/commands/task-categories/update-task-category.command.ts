import { ICommand } from '@nestjs/cqrs';

export class UpdateTaskCategoryCommand implements ICommand {
  constructor(
    readonly id: string,
    readonly dto: {
      readonly title?: string;
      readonly color?: string;
    },
  ) {}
}
