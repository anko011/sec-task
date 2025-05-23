import { ICommand } from '@nestjs/cqrs';

export class CreateTaskCategoryCommand implements ICommand {
  constructor(
    readonly dto: {
      readonly title: string;
      readonly color: string;
    },
  ) {}
}
