import { ICommand } from '@nestjs/cqrs';
import { CreateTaskDTO as EntityCreateTaskDTO } from '../../entities/task-package';

type CreateTaskDTO = Omit<EntityCreateTaskDTO, 'category' | 'name'> & {
  categoryId: string;
  nameId: string;
};

export class CreateTaskCommand implements ICommand {
  constructor(
    readonly packageId: string,
    readonly dto: CreateTaskDTO,
  ) {}
}
