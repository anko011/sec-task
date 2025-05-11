import { ICommand } from '@nestjs/cqrs';

export class DeleteTaskCategoryCommand implements ICommand {
  constructor(readonly id: string) {}
}
