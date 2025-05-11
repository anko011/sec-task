import { ICommand } from '@nestjs/cqrs';
import { UpdateTaskPackageDTO as EntityUpdateTaskPackageDTO } from '../../entities/task-package';

type UpdateTaskPackageDTO = EntityUpdateTaskPackageDTO & {
  id: string;
};

export class UpdateTaskPackageCommand implements ICommand {
  public constructor(public readonly dto: UpdateTaskPackageDTO) {}
}
