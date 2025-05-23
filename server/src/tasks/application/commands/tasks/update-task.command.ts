import { ICommand } from '@nestjs/cqrs';
import { CreateTaskCommand } from './create-task.command';

export class UpdateTaskCommand implements ICommand {
  constructor(
    readonly packageId: string,
    readonly id: string,
    readonly dto: Partial<CreateTaskCommand['dto']>,
  ) {}
}
