import { ICommand } from '@nestjs/cqrs';
import { CreateTaskCategoryDTO } from '../../factories';

export class CreateTaskCategoryCommand implements ICommand {
  constructor(readonly dto: CreateTaskCategoryDTO) {}
}
