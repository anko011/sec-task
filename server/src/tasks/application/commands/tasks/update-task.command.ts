import { ICommand } from '@nestjs/cqrs';
import { UpdateTaskDTO as EntityUpdateDTO } from '../../entities/task-package';

type UpdateTaskDTO = Omit<EntityUpdateDTO, 'category' | 'name'> & {
  categoryId?: string;
  nameId?: string;
};

export class UpdateTaskCommand implements ICommand {
  constructor(
    readonly packageId: string,
    readonly dto: UpdateTaskDTO,
  ) {}
}
