import { ICommand } from '@nestjs/cqrs';
import { CreateTaskNameDTO } from '../../factories';

export class CreateTaskNameCommand implements ICommand {
  constructor(readonly dto: CreateTaskNameDTO) {}
}
